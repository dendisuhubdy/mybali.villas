#!/usr/bin/env python3
"""
Import scraped villa listings into the mybali.villas production database.

Reads all_scraped_listings.json (or scraped_listings.json + villa_bali_listings.json),
deduplicates by title, maps fields to the properties table schema, and generates SQL.

Usage:
    python3 import_scraped_listings.py --data-dir scraped_data --output scraped_data/import.sql

Then on VPS:
    docker exec -i mybalivilla-postgres psql -U mybalivilla -d mybalivilla < import.sql
"""

import json
import os
import re
import uuid
import argparse
from pathlib import Path


ADMIN_OWNER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
BASE_URL = "https://mybali.villas"

VALID_PROPERTY_TYPES = {"villa", "house", "apartment", "land", "commercial"}
VALID_LISTING_TYPES = {"sale", "long_term_rent", "short_term_rent", "sale_freehold", "sale_leasehold"}
VALID_PRICE_PERIODS = {"per_night", "per_week", "per_month", "per_year", None}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text[:490]


def escape_sql(value):
    if value is None:
        return "NULL"
    s = str(value).replace("'", "''").replace("\\", "\\\\")
    return f"'{s}'"


def image_url(path_or_url: str) -> str:
    """Convert a local image path or relative URL to an absolute URL."""
    if path_or_url.startswith("http"):
        return path_or_url
    filename = os.path.basename(path_or_url)
    return f"{BASE_URL}/uploads/{filename}"


def load_listings(data_dir: str):
    """Load listings from available JSON files, deduplicate by title."""
    listings = []
    seen_titles = set()

    # Try combined file first
    combined_file = os.path.join(data_dir, "all_scraped_listings.json")
    if os.path.exists(combined_file):
        with open(combined_file) as f:
            data = json.load(f)
        print(f"Loaded {len(data)} entries from all_scraped_listings.json")
        for entry in data:
            title_key = entry.get("title", "").lower().strip()
            if title_key and title_key not in seen_titles:
                seen_titles.add(title_key)
                listings.append(entry)
        dupes = len(data) - len(listings)
        if dupes:
            print(f"Skipped {dupes} duplicate titles")
    else:
        # Fall back to separate files
        for filename in ["villa_bali_listings.json", "scraped_listings.json"]:
            filepath = os.path.join(data_dir, filename)
            if not os.path.exists(filepath):
                continue
            with open(filepath) as f:
                data = json.load(f)
            print(f"Loaded {len(data)} entries from {filename}")
            added = 0
            for entry in data:
                title_key = entry.get("title", "").lower().strip()
                if title_key and title_key not in seen_titles:
                    seen_titles.add(title_key)
                    listings.append(entry)
                    added += 1
            print(f"  Added {added}, skipped {len(data) - added} duplicates")

    print(f"Total unique listings: {len(listings)}")
    return listings


def listing_to_sql(listing: dict, slug: str) -> str:
    prop_type = listing.get("property_type", "villa")
    if prop_type not in VALID_PROPERTY_TYPES:
        prop_type = "villa"

    list_type = listing.get("listing_type", "sale")
    if list_type not in VALID_LISTING_TYPES:
        list_type = "sale"

    price = listing.get("price", 0)
    if price is None:
        price = 0

    currency = listing.get("currency", "USD")
    if currency not in ("USD", "IDR", "EUR", "AUD"):
        currency = "USD"

    price_period = listing.get("price_period")
    if price_period not in VALID_PRICE_PERIODS:
        price_period = None

    # Build image URLs — prefer local_images (downloaded), fall back to image_urls
    images = []
    if listing.get("local_images"):
        for img in listing["local_images"]:
            images.append(image_url(img))
    elif listing.get("image_urls"):
        for img in listing["image_urls"]:
            images.append(image_url(img))

    thumbnail = images[0] if images else None

    # Deduplicate features
    features = listing.get("features", [])
    seen = set()
    unique_features = []
    for f in features:
        fl = f.lower().strip()
        if fl and fl not in seen:
            seen.add(fl)
            unique_features.append(f)

    area = listing.get("area", "Bali")
    bedrooms = listing.get("bedrooms", 0) or 0
    bathrooms = listing.get("bathrooms", 0) or 0
    lat = listing.get("latitude")
    lng = listing.get("longitude")
    land_size = listing.get("land_size_sqm")
    building_size = listing.get("building_size_sqm")
    description = listing.get("description", "")
    title = listing.get("title", "")

    prop_id = str(uuid.uuid4())
    images_json = json.dumps(images).replace("'", "''")
    features_json = json.dumps(unique_features).replace("'", "''")

    sql = f"""INSERT INTO properties (
    id, owner_id, title, slug, description, property_type, listing_type,
    price, price_period, currency, area, latitude, longitude,
    bedrooms, bathrooms, land_size_sqm, building_size_sqm,
    features, images, thumbnail_url, is_active, is_featured
) VALUES (
    '{prop_id}',
    '{ADMIN_OWNER_ID}',
    {escape_sql(title)},
    {escape_sql(slug)},
    {escape_sql(description)},
    '{prop_type}',
    '{list_type}',
    {price},
    {escape_sql(price_period) if price_period else 'NULL'},
    '{currency}',
    {escape_sql(area)},
    {lat if lat is not None else 'NULL'},
    {lng if lng is not None else 'NULL'},
    {bedrooms},
    {bathrooms},
    {land_size if land_size is not None else 'NULL'},
    {building_size if building_size is not None else 'NULL'},
    '{features_json}'::jsonb,
    '{images_json}'::jsonb,
    {escape_sql(thumbnail)},
    true,
    false
) ON CONFLICT (slug) DO NOTHING;"""

    return sql


def generate_sql(data_dir: str, output_file: str):
    listings = load_listings(data_dir)

    slug_counts = {}
    sql_statements = [
        "-- Import scraped villa listings",
        f"-- Generated: {len(listings)} listings",
        "BEGIN;",
        "",
    ]

    for listing in listings:
        title = listing.get("title", "Untitled Villa")
        base_slug = slugify(title)
        if not base_slug:
            base_slug = "villa"

        if base_slug in slug_counts:
            slug_counts[base_slug] += 1
            slug = f"{base_slug}-{slug_counts[base_slug]}"
        else:
            slug_counts[base_slug] = 0
            slug = base_slug

        sql = listing_to_sql(listing, slug)
        sql_statements.append(sql)
        sql_statements.append("")

    sql_statements.append("COMMIT;")

    with open(output_file, "w") as f:
        f.write("\n".join(sql_statements))

    print(f"Generated SQL file: {output_file}")
    print(f"Total INSERT statements: {len(listings)}")


def main():
    parser = argparse.ArgumentParser(description="Import scraped listings into mybali.villas DB")
    parser.add_argument("--data-dir", default="scraped_data",
                        help="Directory containing JSON files")
    parser.add_argument("--output", default="scraped_data/import.sql",
                        help="Output SQL file path")
    args = parser.parse_args()

    generate_sql(args.data_dir, args.output)


if __name__ == "__main__":
    main()
