import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import "../Donor/DonorData.css"; // Import your CSS file for styling
const DonorData = () => {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('');
  const [donors, setDonors] = useState([]);
  const [socialWorker, setSocialWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const districts = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli' // example districts
  ];
  
  const handleGetDonorData = async () => {
    if (!district) {
      alert('Please select a district');
      return;
    }
    setLoading(true);
    try {
      // Fetch district wise donor details
      const donorsRes = await api.get('/donors', { params: { district } });
      
      if (donorsRes.data.success) {
        setDonors(donorsRes.data.donors);
        // Initialize verification status for each donation
        const initialStatus = {};
        donorsRes.data.donors.forEach(donor => {
          initialStatus[donor.donation_id] = 'pending';
        });
        setVerificationStatus(initialStatus);
      }
    } catch (error) {
      console.error('Error fetching donor data:', error);
      alert('Failed to fetch donor data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDonation = async (donationId) => {
    try {
      setSelectedDonation(donationId);
      // Notify social worker about verification request
      const notifyRes = await api.post('/notify-social-worker', { district, donationId });
      if (notifyRes.data.success) {
        setSocialWorker(notifyRes.data.socialWorker);
        // Wait for social worker to complete verification, then refetch donors
        setTimeout(async () => {
          const donorsRes = await api.get('/donors', { params: { district } });
          if (donorsRes.data.success) {
            setDonors(donorsRes.data.donors);
          }
        }, 2000); // Simulate delay for verification
      }
    } catch (error) {
      console.error('Error in verification process:', error);
      alert('Verification process failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>District Wise Donor Details</h2>
      
      {/* District Selection */}
      <div className="district-selection">
        <label>Select District: </label>
        <select 
          value={district} 
          onChange={e => setDistrict(e.target.value)}
        >
          <option value="">-- Select --</option>
          {districts.map((d, idx) => (
            <option key={idx} value={d}>{d}</option>
          ))}
        </select>
        <button 
          onClick={handleGetDonorData} 
          disabled={loading}
          className="fetch-btn"
        >
          {loading ? 'Loading...' : 'Get Donor Data'}
        </button>
      </div>
      
      {/* Donor List with Verification Status */}
      {donors.length > 0 && (
        <div className="donor-list">
          <h3>Donor Details</h3>
          {donors.map((donor, idx) => (
            <div key={donor.donation_id} className="donor-card">
              <div className="donor-info">
                <strong>{donor.food_type}</strong>
                <p>{donor.description || 'No description'}</p>
                <p>Quantity: {donor.quantity} {donor.unit}</p>
                <p>Address: {donor.address}, {donor.city}, {donor.zip_code}</p>
              </div>
              <div className="verification-section">
                <span className={`status ${donor.status}`}>
                  Status: {donor.status}
                </span>
                {donor.status === 'pending' && (
                  <button 
                    onClick={() => handleVerifyDonation(donor.donation_id)}
                    className="verify-btn"
                  >
                    Verify Donation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Social Worker Details */}
      {socialWorker && (
        <div className="social-worker-details">
          <h3>Assigned Social Worker</h3>
          <div className="social-worker-card">
            <p><strong>Name:</strong> {socialWorker.name}</p>
            <p><strong>Phone:</strong> {socialWorker.phone}</p>
            <p><strong>Email:</strong> {socialWorker.email}</p>
            <p><strong>District:</strong> {socialWorker.district}</p>
            <p className="verification-note">
              This social worker has been notified and will verify the donation.
            </p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-btn"
        style={{ marginTop: '20px' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default DonorData;
