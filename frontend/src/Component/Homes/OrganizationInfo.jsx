// components/steps/OrganizationInfo.js
import React from 'react';

const OrganizationInfo = ({ formData, handleChange }) => {
  return (
    <div className="form-step">
      <h3>Organization Information</h3>
      
      <div className="form-group">
        <label htmlFor="organizationName">Organization Name*</label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="organizationType">Organization Type*</label>
        <select
          id="organizationType"
          name="organizationType"
          value={formData.organizationType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="ngo">NGO</option>
          <option value="oldAgeHome">Old Age Home</option>
          <option value="orphanage">Orphanage</option>
          <option value="shelter">Shelter Home</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="registrationNumber">Registration Number</label>
        <input
          type="text"
          id="registrationNumber"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="establishedYear">Year Established</label>
        <input
          type="number"
          id="establishedYear"
          name="establishedYear"
          value={formData.establishedYear}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
    </div>
  );
};

export default OrganizationInfo;