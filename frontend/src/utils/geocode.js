/**
 * Reverse geocode via Nominatim (dev / light use). Respect their usage policy in production.
 */
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en',
      'User-Agent': 'Help2Others/1.0 (community food donation; contact: local)',
    },
  });
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  const a = data.address || {};
  const line = [a.road, a.neighbourhood, a.suburb].filter(Boolean).join(', ');
  return {
    address: line || (data.display_name ? data.display_name.split(',').slice(0, 3).join(', ') : ''),
    city: a.city || a.town || a.village || a.municipality || '',
    zipCode: a.postcode || '',
    district: a.city || a.county || a.state_district || '',
  };
}
