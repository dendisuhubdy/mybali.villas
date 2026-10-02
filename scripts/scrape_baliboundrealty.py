#!/usr/bin/env python3
"""
Scrape all listings from baliboundrealty.com and generate an upsert SQL file
for the mybali.villas properties table.

Source: the site's public XML property feed (served at https://baliboundrealty.com/xml),
which carries every public listing (sale, rent, developments, opportunities).

Each listing is imported with Balibound Realty's enquiry contact (as shown on
their listing pages) in the contact_* columns and its original URL in source_url,
so re-running the script updates existing rows instead of duplicating them.
Listings that have disappeared from the feed are deactivated.

Usage:
    python3 scripts/scrape_baliboundrealty.py
    python3 scripts/scrape_baliboundrealty.py --skip-images   # reuse downloaded images

Outputs:
    scraped_data/baliboundrealty/feed.xml
    scraped_data/baliboundrealty/listings.json
    scraped_data/baliboundrealty/import.sql
    scraped_data/images/bbr-*.jpg

Then:
    rsync -av scraped_data/images/bbr-* root@<server>:/opt/mybalivilla/uploads/
    docker exec -i mybalivilla-postgres psql -U mybalivilla -d mybalivilla < import.sql
"""

import argparse
import hashlib
import json
import os
import re
import urllib.request
import uuid
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor

FEED_URL = "https://sbogoszoeywfhjxgkzgp.supabase.co/functions/v1/property-feed"
SOURCE_PREFIX = "https://baliboundrealty.com/"
ADMIN_OWNER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
BASE_URL = "https://mybali.villas"
USER_AGENT = "Mozilla/5.0 (compatible; mybali.villas listing sync)"
MAX_IMAGES = 20

# Enquiry contact shown on every baliboundrealty.com listing page
CONTACT = {
    "contact_name": "Balibound Realty",
    "contact_company": "PT. Bali Bound Ventures",
    "contact_phone": "+62 821 4451 1556",
    "contact_whatsapp": "+62 823 4193 6209",
    "contact_email": "info@baliboundrealty.com",
}

# Canonical mybali.villas area names (see areas-data.ts / area normalization)
CANONICAL_AREAS = {
    "Canggu", "Seminyak", "Pererenan", "Uluwatu", "Jimbaran", "Ubud", "Berawa",
    "Umalas", "Sanur", "Nusa Dua", "Kerobokan", "Ungasan", "Seseh", "Bingin",
    "Tumbak Bayuh", "Legian", "Balangan", "Pecatu", "Tabanan", "Candidasa",
    "Cemagi", "Lovina", "Balian", "Munggu", "Kuta", "Mengwi", "Denpasar", "Amed",
    "Tegallalang",
}

NEIGHBOURHOOD_TO_AREA = {
    "babakan": "Canggu", "tibubeneng": "Canggu", "batu bolong": "Canggu",
    "padonan": "Canggu", "padanan": "Canggu", "kulat": "Canggu",
    "pererenan beach": "Pererenan",
    "batu belig": "Seminyak", "batubelig": "Seminyak",
    "nyanyi": "Tabanan", "kedungu": "Tabanan", "beraban": "Tabanan", "kaba-kaba": "Tabanan",
    "buduk": "Mengwi", "dalung": "Mengwi", "cepaka": "Mengwi", "gerih": "Mengwi",
    "pandawa": "Nusa Dua", "pandawa beach": "Nusa Dua", "kutuh": "Nusa Dua",
    "melasti": "Ungasan", "desa ungasan": "Ungasan",
    "nyang nyang": "Uluwatu", "nyang-nyang": "Uluwatu", "padang padang": "Uluwatu",
    "pejeng": "Ubud", "pejeng kangin": "Ubud", "penestanan": "Ubud", "sayan": "Ubud",
    "singakerta": "Ubud", "singakarta": "Ubud", "tampaksiring": "Ubud", "bedulu": "Ubud",
    "lodtunduh": "Ubud", "nyuh kuning": "Ubud", "petulu": "Ubud", "mas": "Ubud",
    "peliatan": "Ubud", "pengosekan": "Ubud", "singapadu": "Ubud", "sanding": "Ubud",
    "tegalalang": "Tegallalang",
    "kubu anyar": "Kuta",
}

REGION_TO_AREA = {
    "kuta utara": "Canggu", "bukit peninsula": "Uluwatu", "bukit": "Uluwatu",
    "gianyar": "Ubud", "mengwi": "Mengwi", "tabanan": "Tabanan", "denpasar": "Denpasar",
    "kuta tengah": "Kuta", "canggu": "Canggu", "ubud": "Ubud", "abiansemal": "Mengwi",
}


def text(el, tag):
    v = el.findtext(tag)
    return v.strip() if v and v.strip() else None


def num(el, tag):
    v = text(el, tag)
    try:
        return float(v) if v is not None else None
    except ValueError:
        return None


def normalize_area(p) -> str:
    for raw in (text(p, "neighbourhood"), text(p, "city")):
        if not raw:
            continue
        first = re.split(r"\s*[·&/,]\s*", raw)[0].strip()
        for name in CANONICAL_AREAS:
            if first.lower() == name.lower():
                return name
        if first.lower() in NEIGHBOURHOOD_TO_AREA:
            return NEIGHBOURHOOD_TO_AREA[first.lower()]
    region = (text(p, "area") or "").split("&")[0].strip().lower()
    if region in REGION_TO_AREA:
        return REGION_TO_AREA[region]
    # Outside Bali (e.g. Gili Trawangan) — keep the source neighbourhood
    return text(p, "neighbourhood") or text(p, "area") or "Bali"


def map_property_type(p) -> str:
    concept = (text(p, "concept") or "").lower()
    if text(p, "type") == "Commercial" or "hotel" in concept or "venue" in concept:
        return "commercial"
    if concept in ("apartment", "studio"):
        return "apartment"
    if concept in ("townhouse", "tiny home"):
        return "house"
    return "villa"


def map_pricing(p):
    """Return (listing_type, price, currency, price_period)."""
    if text(p, "bbr_type") == "villa-rent":
        term = (text(p, "rental_term_type") or "").lower()
        period = "per_year" if term == "yearly" else "per_month"
        price_idr = num(p, "price_idr")
        if price_idr:
            return "long_term_rent", price_idr, "IDR", period
        return "long_term_rent", num(p, "price") or 0, "USD", period

    ownership = (text(p, "ownership_term") or "").lower()
    listing_type = "sale_freehold" if ownership.startswith("freehold") else "sale_leasehold"
    return listing_type, num(p, "price") or 0, "USD", None


def build_features(p) -> list:
    features = [f.text.strip() for f in p.findall("features/feature") if f.text and f.text.strip()]
    ownership = text(p, "ownership_term")
    years = text(p, "leasehold_years")
    if ownership and ownership.upper() != "TBC":
        features.append(f"{ownership} ({years} years)" if years and ownership == "Leasehold" else ownership)
    if text(p, "extension_years"):
        features.append(f"Lease extension: {text(p, 'extension_years')} years")
    for tag, label in (("furnished", "Furnished"), ("style", "Style"), ("build_year", "Built")):
        v = text(p, tag)
        if not v or v.upper() == "TBC":
            continue
        if tag == "furnished":
            if v.lower() == "yes":
                features.append("Furnished")
            elif v.lower() != "no":
                features.append(f"Furnished: {v}")
        else:
            features.append(f"{label}: {v}")
    if text(p, "estimated_completion"):
        features.append(f"Estimated completion: {text(p, 'estimated_completion')}")
    if text(p, "total_units"):
        features.append(f"Total units: {text(p, 'total_units')}")
    if text(p, "available_from"):
        features.append(f"Available from {text(p, 'available_from')}")
    if text(p, "min_term"):
        features.append(f"Minimum term: {text(p, 'min_term')} months")

    seen, unique = set(), []
    for f in features:
        if f.lower() not in seen:
            seen.add(f.lower())
            unique.append(f)
    return unique


def build_description(p) -> str:
    desc = text(p, "description") or ""
    extras = []
    label = text(p, "price_label") or text(p, "price_caption")
    if label:
        extras.append(label)
    if text(p, "price_to"):
        extras.append(f"Prices from USD {num(p, 'price'):,.0f} to USD {num(p, 'price_to'):,.0f}")
    if extras:
        desc += "\n\n" + "\n".join(extras)
    return desc


def image_source(url: str) -> str:
    """Use Supabase's resized render endpoint (1200px) instead of the full original."""
    if not url.startswith("http"):
        return SOURCE_PREFIX + url.lstrip("/")
    if "/storage/v1/object/public/" in url:
        return url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/") + "?width=1200&quality=72"
    return url


def parse_feed(xml_bytes: bytes) -> list:
    root = ET.fromstring(xml_bytes)
    listings = []
    for p in root.findall("property"):
        ref = text(p, "reference") or text(p, "id")
        listing_type, price, currency, period = map_pricing(p)
        land = num(p, "land_size")
        size = num(p, "size")
        listings.append({
            "ref": ref,
            "source_url": text(p, "url"),
            "bbr_type": text(p, "bbr_type"),
            "title": text(p, "title"),
            "description": build_description(p),
            "property_type": map_property_type(p),
            "listing_type": listing_type,
            "price": price,
            "currency": currency,
            "price_period": period,
            "area": normalize_area(p),
            "address": text(p, "address"),
            "latitude": num(p, "latitude"),
            "longitude": num(p, "longitude"),
            "bedrooms": int(num(p, "bedrooms") or 0),
            "bathrooms": int(num(p, "bathrooms") or 0),
            "land_size_sqm": land if land else None,
            "building_size_sqm": size if size else None,
            "year_built": int(num(p, "build_year")) if num(p, "build_year") else None,
            "features": build_features(p),
            "image_urls": [i.text.strip() for i in p.findall("images/image") if i.text][:MAX_IMAGES],
            **CONTACT,
        })
    return listings


def image_filename(url: str) -> str:
    return f"bbr-{hashlib.sha1(url.encode()).hexdigest()[:20]}.jpg"


def download(job):
    src, dest = job
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    try:
        req = urllib.request.Request(image_source(src), headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        if len(data) < 1000:
            return None
        with open(dest, "wb") as f:
            f.write(data)
        return dest
    except Exception as e:
        print(f"  ! image failed {src}: {e}")
        return None


def download_images(listings, images_dir, skip):
    os.makedirs(images_dir, exist_ok=True)
    jobs = []
    for l in listings:
        l["local_images"] = []
        for url in l["image_urls"]:
            # Named by source image URL: refs are not unique across listings
            dest = os.path.join(images_dir, image_filename(url))
            l["local_images"].append(dest)
            jobs.append((url, dest))
    if skip:
        for l in listings:
            l["local_images"] = [d for d in l["local_images"] if os.path.exists(d)]
        return
    print(f"Downloading {len(jobs)} images...")
    with ThreadPoolExecutor(max_workers=16) as pool:
        ok = set(filter(None, pool.map(download, jobs)))
    print(f"  {len(ok)}/{len(jobs)} images available")
    for l in listings:
        l["local_images"] = [d for d in l["local_images"] if d in ok]


def sql_str(v):
    if v is None:
        return "NULL"
    return "'" + str(v).replace("'", "''") + "'"


def sql_num(v):
    return "NULL" if v is None else repr(v)


def slugify(title: str, ref: str) -> str:
    s = re.sub(r"[^\w\s-]", "", title.lower())
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")[:400]
    return f"{s}-{ref.lower()}"


def listing_sql(l) -> str:
    images = [f"{BASE_URL}/uploads/{os.path.basename(p)}" for p in l["local_images"]]
    images_json = json.dumps(images).replace("'", "''")
    features_json = json.dumps(l["features"], ensure_ascii=False).replace("'", "''")
    return f"""INSERT INTO properties (
    id, owner_id, title, slug, description, property_type, listing_type,
    price, price_period, currency, area, address, latitude, longitude,
    bedrooms, bathrooms, land_size_sqm, building_size_sqm, year_built,
    features, images, thumbnail_url, is_active, is_featured,
    contact_name, contact_company, contact_phone, contact_whatsapp, contact_email, source_url
) VALUES (
    '{uuid.uuid4()}', '{ADMIN_OWNER_ID}', {sql_str(l['title'][:495])}, {sql_str(slugify(l['title'], l['ref']))},
    {sql_str(l['description'])}, '{l['property_type']}', '{l['listing_type']}',
    {l['price']}, {sql_str(l['price_period'])}{'::price_period' if l['price_period'] else ''}, '{l['currency']}',
    {sql_str(l['area'][:250])}, {sql_str(l['address'])}, {sql_num(l['latitude'])}, {sql_num(l['longitude'])},
    {l['bedrooms']}, {l['bathrooms']}, {sql_num(l['land_size_sqm'])}, {sql_num(l['building_size_sqm'])}, {sql_num(l['year_built'])},
    '{features_json}'::jsonb, '{images_json}'::jsonb, {sql_str(images[0] if images else None)}, true, false,
    {sql_str(l['contact_name'])}, {sql_str(l['contact_company'])}, {sql_str(l['contact_phone'])},
    {sql_str(l['contact_whatsapp'])}, {sql_str(l['contact_email'])}, {sql_str(l['source_url'])}
) ON CONFLICT (source_url) WHERE source_url IS NOT NULL DO UPDATE SET
    title = EXCLUDED.title, description = EXCLUDED.description,
    property_type = EXCLUDED.property_type, listing_type = EXCLUDED.listing_type,
    price = EXCLUDED.price, price_period = EXCLUDED.price_period, currency = EXCLUDED.currency,
    area = EXCLUDED.area, address = EXCLUDED.address,
    latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
    bedrooms = EXCLUDED.bedrooms, bathrooms = EXCLUDED.bathrooms,
    land_size_sqm = EXCLUDED.land_size_sqm, building_size_sqm = EXCLUDED.building_size_sqm,
    year_built = EXCLUDED.year_built, features = EXCLUDED.features,
    images = EXCLUDED.images, thumbnail_url = EXCLUDED.thumbnail_url, is_active = true,
    contact_name = EXCLUDED.contact_name, contact_company = EXCLUDED.contact_company,
    contact_phone = EXCLUDED.contact_phone, contact_whatsapp = EXCLUDED.contact_whatsapp,
    contact_email = EXCLUDED.contact_email, updated_at = NOW();"""


def generate_sql(listings, output_file):
    urls = ", ".join(sql_str(l["source_url"]) for l in listings)
    active_bbr = f"(SELECT count(*) FROM properties WHERE source_url LIKE '{SOURCE_PREFIX}%' AND is_active)"
    statements = [
        f"-- Balibound Realty sync: {len(listings)} listings",
        "BEGIN;",
        # The feed occasionally returns a partial result (e.g. without off-plan units);
        # only deactivate when this feed is close to the size of what is already live.
        f"CREATE TEMP TABLE bbr_sync_guard ON COMMIT DROP AS SELECT {len(listings)} >= 0.8 * {active_bbr} AS ok;",
        *[listing_sql(l) for l in listings],
        "-- Deactivate listings no longer on baliboundrealty.com",
        f"UPDATE properties SET is_active = false, updated_at = NOW()\n"
        f"WHERE source_url LIKE '{SOURCE_PREFIX}%' AND is_active AND (SELECT ok FROM bbr_sync_guard)\n"
        f"  AND source_url NOT IN ({urls});",
        "COMMIT;",
    ]
    with open(output_file, "w") as f:
        f.write("\n\n".join(statements) + "\n")


def main():
    parser = argparse.ArgumentParser(description="Scrape baliboundrealty.com into mybali.villas SQL")
    parser.add_argument("--out-dir", default="scraped_data/baliboundrealty")
    parser.add_argument("--images-dir", default="scraped_data/images")
    parser.add_argument("--skip-images", action="store_true", help="Don't download, use existing files")
    args = parser.parse_args()
    os.makedirs(args.out_dir, exist_ok=True)

    print(f"Fetching feed {FEED_URL}")
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=120) as r:
        xml_bytes = r.read()
    with open(os.path.join(args.out_dir, "feed.xml"), "wb") as f:
        f.write(xml_bytes)

    listings = [l for l in parse_feed(xml_bytes) if l["title"] and l["source_url"]]
    declared = ET.fromstring(xml_bytes).findtext("count")
    print(f"Parsed {len(listings)} listings (feed declares {declared})")
    if declared and declared.isdigit() and len(listings) < int(declared):
        raise SystemExit("Feed returned fewer listings than it declares; re-run the sync")

    download_images(listings, args.images_dir, args.skip_images)

    with open(os.path.join(args.out_dir, "listings.json"), "w") as f:
        json.dump(listings, f, indent=2, ensure_ascii=False)

    sql_file = os.path.join(args.out_dir, "import.sql")
    generate_sql(listings, sql_file)
    print(f"Wrote {sql_file}")


if __name__ == "__main__":
    main()
