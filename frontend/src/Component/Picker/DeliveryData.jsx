import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../utils/api';

const DeliveryData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/delivery-volunteers`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.volunteers || []);
        else setError('Failed to fetch data');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading volunteers...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Delivery Volunteers Data</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0f7fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>District</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {data.map(v => (
              <tr key={v.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.district}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{v.vehicleType} ({v.vehicleNumber})</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No delivery volunteers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryData;
