import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../utils/api';

const SocialWorkerData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/social-workers`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.socialWorkers || []);
        else setError('Failed to fetch data');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading social workers...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Social Workers Data</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e8f5e9' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>District</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map(w => (
              <tr key={w.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{w.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{w.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{w.district}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{w.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{w.email}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No social workers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialWorkerData;
