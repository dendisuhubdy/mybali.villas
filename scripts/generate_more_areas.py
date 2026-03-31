#!/usr/bin/env python3
"""Generate images for additional Bali areas."""

import json, base64, time, os, urllib.request, urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash-image"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "frontend", "public", "images", "areas")
os.makedirs(OUT_DIR, exist_ok=True)

AREAS = [
    ("seminyak", "Beautiful aerial photograph of Seminyak Bali, upscale beachside area with trendy beach clubs, golden sand beach, luxury villas and restaurants, palm trees, vibrant sunset, professional travel photography"),
    ("jimbaran", "Beautiful aerial photograph of Jimbaran Bay Bali, sweeping crescent bay with seafood restaurants on beach, traditional fishing boats, spectacular sunset, professional travel photography"),
    ("kuta", "Beautiful aerial photograph of Kuta Bali, wide sandy beach with surfers, bustling tourist area, colorful beachfront, aircraft near airport, vibrant energy, professional travel photography"),
    ("denpasar", "Beautiful aerial photograph of Denpasar Bali, the capital city with Bajra Sandhi monument, traditional markets, modern buildings mixed with Balinese architecture, green parks, busy streets, professional travel photography"),
    ("lovina", "Beautiful aerial photograph of Lovina Beach north Bali, calm black sand beach at sunrise, traditional fishing boats, dolphin watching area, Mount Agung in distance, peaceful atmosphere, professional travel photography"),
    ("amed", "Beautiful aerial photograph of Amed Bali, remote eastern coastline with volcanic black sand beaches, traditional fishing village, Mount Agung backdrop, coral reefs visible in clear water, professional travel photography"),
    ("candidasa", "Beautiful aerial photograph of Candidasa east Bali, tranquil coastal town with lotus lagoon, rocky coastline, lush hillside, traditional Balinese temples near shore, professional travel photography"),
    ("tegallalang", "Beautiful aerial photograph of Tegallalang rice terraces Bali, iconic cascading emerald green terraced paddies, palm trees, traditional subak irrigation, morning golden light, professional travel photography"),
]

def generate_image(slug, prompt):
    outfile = os.path.join(OUT_DIR, f"{slug}.jpg")
    if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
        print(f"  SKIP (exists, {os.path.getsize(outfile)} bytes)")
        return True
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"responseModalities": ["IMAGE"]}}).encode("utf-8")
    req = urllib.request.Request(ENDPOINT, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  HTTP ERROR {e.code}: {e.read().decode()[:200]}")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            if "inlineData" in part:
                img_bytes = base64.b64decode(part["inlineData"]["data"])
                with open(outfile, "wb") as f:
                    f.write(img_bytes)
                print(f"  OK: {len(img_bytes):,} bytes")
                return True
    print("  ERROR: No image data")
    return False

def main():
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set"); return
    for i, (slug, prompt) in enumerate(AREAS, 1):
        print(f"[{i}/{len(AREAS)}] {slug}")
        generate_image(slug, prompt)
        if i < len(AREAS): time.sleep(3)
    print("Done")

if __name__ == "__main__":
    main()
