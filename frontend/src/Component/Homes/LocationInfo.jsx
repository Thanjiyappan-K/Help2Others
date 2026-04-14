// components/steps/LocationInfo.js
import React from 'react';
import { indianStates, getDistricts } from '../../utils/locationData';

const LocationInfo = ({ formData, handleChange }) => {
  return (
    <div className="form-step">
      <h3>Location Information</h3>
      
      <div className="form-group">
        <label htmlFor="state">State*</label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          {indianStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="district">District*</label>
        <select
          id="district"
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">Select District</option>
          {getDistricts(formData.state).map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Full Address*</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="pincode">PIN Code*</label>
        <input
          type="text"
          id="pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          maxLength="6"
          pattern="[0-9]{6}"
        />
      </div>
    </div>
  );
};

export default LocationInfo;