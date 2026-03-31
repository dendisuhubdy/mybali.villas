'use client';

import { useState, useEffect } from 'react';

const heroImages = [
  '/images/hero/bali-rice-terraces-1.jpg',
  '/images/hero/bali-rice-terraces-2.jpg',
  '/images/hero/bali-tropical-villa.jpg',
  '/images/hero/bali-beach-sunset.jpg',
  '/images/hero/bali-jungle-retreat.jpg',
];

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
