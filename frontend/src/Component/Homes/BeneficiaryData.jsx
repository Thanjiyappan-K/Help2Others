import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../utils/api';

const BeneficiaryData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/beneficiaries`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.beneficiaries || []);
        else setError('Failed to fetch data');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading beneficiaries...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Beneficiary Data</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Org Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>District</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Contact</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.organizationName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.organizationType}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.district}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.contactPerson} ({b.phoneNumber})</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{b.totalCapacity}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No beneficiaries found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BeneficiaryData;
