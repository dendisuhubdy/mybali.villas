'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with webpack/next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Known Bali area coordinates for fallback geocoding
const BALI_AREAS: Record<string, [number, number]> = {
  'ubud': [-8.5069, 115.2624],
  'seminyak': [-8.6908, 115.1581],
  'canggu': [-8.6478, 115.1385],
  'kuta': [-8.7184, 115.1686],
  'jimbaran': [-8.7908, 115.1612],
  'nusa dua': [-8.8007, 115.2269],
  'sanur': [-8.6879, 115.2620],
  'uluwatu': [-8.8291, 115.0849],
  'tabanan': [-8.5411, 115.1249],
  'denpasar': [-8.6500, 115.2167],
  'lovina': [-8.1528, 115.0255],
  'amed': [-8.3500, 115.6500],
  'candidasa': [-8.5000, 115.5667],
  'karangasem': [-8.4500, 115.6000],
  'gianyar': [-8.5333, 115.3167],
  'klungkung': [-8.5347, 115.4042],
  'bangli': [-8.4544, 115.3500],
  'buleleng': [-8.1120, 115.0882],
  'badung': [-8.5819, 115.1773],
  'tegallalang': [-8.4319, 115.2792],
  'pecatu': [-8.8100, 115.1300],
  'pererenan': [-8.6400, 115.1200],
  'berawa': [-8.6600, 115.1450],
  'kerobokan': [-8.6700, 115.1550],
  'ungasan': [-8.8200, 115.1700],
  'kedungu': [-8.6100, 115.0800],
  'singakerta': [-8.4700, 115.2400],
  'bali': [-8.4095, 115.1889],
};

function findAreaCoords(area: string): [number, number] | null {
  const lower = area.toLowerCase();
  for (const [key, coords] of Object.entries(BALI_AREAS)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  return null;
}

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  area: string;
  title: string;
}

export default function PropertyMap({ latitude, longitude, area, title }: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="aspect-[16/9] rounded-lg bg-gray-100 flex items-center justify-center animate-pulse">
        <span className="text-sm text-gray-400">Loading map...</span>
      </div>
    );
  }

  let center: [number, number];
  let zoom = 14;
  let hasExactLocation = false;

  if (latitude && longitude) {
    center = [latitude, longitude];
    hasExactLocation = true;
  } else {
    const areaCoords = findAreaCoords(area);
    if (areaCoords) {
      center = areaCoords;
      zoom = 13;
    } else {
      // Default to central Bali
      center = [-8.4095, 115.1889];
      zoom = 10;
    }
  }

  return (
    <div className="aspect-[16/9] rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <strong>{title}</strong>
            <br />
            {area}, Bali
            {!hasExactLocation && (
              <>
                <br />
                <span className="text-xs text-gray-500">Approximate location</span>
              </>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
