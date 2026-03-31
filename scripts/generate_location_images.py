#!/usr/bin/env python3
"""Generate missing location images for Browse by Location section."""

import json
import base64
import time
import os
import urllib.request
import urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash-image"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "frontend", "public", "images", "areas")
os.makedirs(OUT_DIR, exist_ok=True)

# Only generate missing images
AREAS = [
    ("tabanan",
     "Beautiful aerial landscape photograph of Tabanan Bali, vast emerald green rice terraces stretching to the horizon, Jatiluwih UNESCO heritage terraces, black volcanic sand beaches, Mount Batukaru in misty background, traditional Balinese water temples, peaceful rural atmosphere, golden hour lighting, professional travel photography"),
    ("pererenan",
     "Beautiful aerial landscape photograph of Pererenan Bali, quiet coastal village next to Canggu, dramatic ocean sunset with orange and purple sky, lush rice paddies meeting the coastline, traditional Balinese temples near the beach, scattered luxury villas among tropical vegetation, peaceful surf break, professional travel photography"),
    ("mengwi",
     "Beautiful aerial landscape photograph of Mengwi Bali, the magnificent Taman Ayun royal temple with its layered pagodas and moat surrounded by lush tropical gardens, rice paddies stretching to distant mountains, traditional Balinese village architecture, serene morning atmosphere with mist, professional travel photography"),
]


def generate_image(slug, prompt):
    outfile = os.path.join(OUT_DIR, f"{slug}.jpg")
    if os.path.exists(outfile) and os.path.getsize(outfile) > 1000:
        print(f"  SKIP (already exists, {os.path.getsize(outfile)} bytes)")
        return True

    body = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]}
    }).encode("utf-8")

    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"  HTTP ERROR {e.code}: {err_body[:300]}")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

    if "error" in data:
        print(f"  API ERROR: {data['error'].get('message', 'unknown')}")
        return False

    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            if "inlineData" in part:
                img_bytes = base64.b64decode(part["inlineData"]["data"])
                with open(outfile, "wb") as f:
                    f.write(img_bytes)
                print(f"  OK: {len(img_bytes):,} bytes -> {outfile}")
                return True

    print("  ERROR: No image data in response")
    return False


def main():
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set")
        return

    print(f"=== Generating {len(AREAS)} location images ===")
    print(f"Model: {MODEL}")
    print(f"Output: {OUT_DIR}")
    print()

    success = 0
    for i, (slug, prompt) in enumerate(AREAS, 1):
        print(f"[{i}/{len(AREAS)}] {slug}")
        if generate_image(slug, prompt):
            success += 1
        if i < len(AREAS):
            time.sleep(3)

    print(f"\n=== Done! {success}/{len(AREAS)} images generated ===")


if __name__ == "__main__":
    main()
