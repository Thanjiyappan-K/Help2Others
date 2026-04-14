import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({ iconRetinaUrl: iconRetina, iconUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const pickupIcon = L.divIcon({
  className: 'h2o-map-pin',
  html: '<div style="background:#22c55e;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const dropIcon = L.divIcon({
  className: 'h2o-map-pin',
  html: '<div style="background:#3b82f6;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds({ points }) {
  const map = useMap();
  React.useEffect(() => {
    const valid = points.filter((p) => p?.lat != null && p?.lng != null);
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView([valid[0].lat, valid[0].lng], 14);
      return;
    }
    const b = L.latLngBounds(valid.map((p) => [p.lat, p.lng]));
    map.fitBounds(b, { padding: [28, 28], maxZoom: 15 });
  }, [map, points]);
  return null;
}

/**
 * @param {{ markers: Array<{ lat: number, lng: number, label: string, kind?: 'pickup'|'drop' }>, route?: [number, number][], height?: string }} props
 */
export default function MapView({ markers = [], route = null, height = '240px' }) {
  const validMarkers = markers.filter((m) => m.lat != null && m.lng != null);
  const center = validMarkers[0] ? [validMarkers[0].lat, validMarkers[0].lng] : [13.0827, 80.2707];

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
      <MapContainer center={center} zoom={13} style={{ height, width: '100%' }} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={validMarkers} />
        {route && route.length >= 2 && <Polyline positions={route} pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.85 }} />}
        {validMarkers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={m.kind === 'drop' ? dropIcon : pickupIcon}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
