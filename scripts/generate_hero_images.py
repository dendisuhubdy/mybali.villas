#!/usr/bin/env python3
"""Generate hero slideshow images of Bali landscapes."""

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
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "frontend", "public", "images", "hero")
os.makedirs(OUT_DIR, exist_ok=True)

IMAGES = [
    ("bali-rice-terraces-1",
     "Stunning wide panoramic photograph of Bali's iconic Tegallalang rice terraces at golden hour, cascading emerald green terraced rice paddies with palm trees, warm golden sunlight, dramatic sky with scattered clouds, ultra-high quality landscape photography, 21:9 aspect ratio"),
    ("bali-rice-terraces-2",
     "Beautiful aerial photograph of Jatiluwih UNESCO rice terraces in Bali at sunrise, vast expansive green rice paddies stretching to misty mountains, morning fog in valleys, traditional Balinese subak irrigation channels, warm light, panoramic landscape photography, 21:9 aspect ratio"),
    ("bali-tropical-villa",
     "Luxurious modern Balinese villa with infinity pool overlooking lush green rice paddies and tropical jungle at sunset, warm ambient lighting, palm trees silhouetted against orange sky, premium real estate photography, panoramic wide shot, 21:9 aspect ratio"),
    ("bali-beach-sunset",
     "Spectacular panoramic sunset over Bali coastline, dramatic orange and purple sky reflected in calm ocean water, silhouetted palm trees along the shore, traditional Balinese temple in the distance, premium travel photography, wide panoramic landscape, 21:9 aspect ratio"),
    ("bali-jungle-retreat",
     "Breathtaking aerial view of a luxury villa estate nestled in Bali's dense tropical jungle with towering palm trees, a winding river below, morning mist rising from the canopy, rice terraces visible in the background, lush green vegetation everywhere, professional drone photography, 21:9 aspect ratio"),
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
        ENDPOINT, data=body,
        headers={"Content-Type": "application/json"}, method="POST"
    )

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
                print(f"  OK: {len(img_bytes):,} bytes -> {outfile}")
                return True

    print("  ERROR: No image data in response")
    return False


def main():
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set")
        return
    print(f"=== Generating {len(IMAGES)} hero images ===")
    for i, (slug, prompt) in enumerate(IMAGES, 1):
        print(f"[{i}/{len(IMAGES)}] {slug}")
        generate_image(slug, prompt)
        if i < len(IMAGES):
            time.sleep(3)
    print("=== Done ===")


if __name__ == "__main__":
    main()
