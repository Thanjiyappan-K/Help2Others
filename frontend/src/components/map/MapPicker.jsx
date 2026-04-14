import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({ iconRetinaUrl: iconRetina, iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.[0] != null && center?.[1] != null) map.setView(center, map.getZoom() > 14 ? map.getZoom() : 15);
  }, [center, map]);
  return null;
}

/**
 * @param {{ lat: number, lng: number, onPositionChange: (lat: number, lng: number) => void, height?: string }} props
 */
export default function MapPicker({ lat, lng, onPositionChange, height = '220px' }) {
  const center = [
    typeof lat === 'number' && !Number.isNaN(lat) ? lat : 13.0827,
    typeof lng === 'number' && !Number.isNaN(lng) ? lng : 80.2707,
  ];

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
      <MapContainer center={center} zoom={15} style={{ height, width: '100%' }} scrollWheelZoom>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter center={center} />
        <Marker
          position={center}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = e.target.getLatLng();
              onPositionChange(p.lat, p.lng);
            },
          }}
        />
      </MapContainer>
      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', padding: '8px 12px', margin: 0, background: 'var(--surface)' }}>
        Drag the pin to fine-tune the pickup point.
      </p>
    </div>
  );
}
