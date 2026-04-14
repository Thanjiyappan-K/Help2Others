import React from 'react';

const LocationForm = ({ 
  formData, 
  errors, 
  handleInputChange, 
  handleGetCurrentLocation, 
  handleUseProfileAddress, 
  handleNextStep, 
  handlePrevStep 
}) => {
  return (
    <div className="step-form location">
      <h3 className="step-title">Location & Instructions</h3>
      
      <div className="form-group">
        <label htmlFor="address">Address*</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Street address"
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <div className="error-message">{errors.address}</div>}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="city">City*</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <div className="error-message">{errors.city}</div>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="zipCode">ZIP Code*</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="ZIP code"
            className={errors.zipCode ? 'error' : ''}
          />
          {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="specialInstructions">Special Instructions</label>
        <textarea
          id="specialInstructions"
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleInputChange}
          placeholder="Add any special pickup instructions"
          rows="3"
        />
      </div>
      
      <div className="location-options">
        <button type="button" className="use-current-location" onClick={handleGetCurrentLocation}>
          <i className="fas fa-map-marker-alt"></i> Use Current Location
        </button>
        <button type="button" className="use-profile-address" onClick={handleUseProfileAddress}>
          <i className="fas fa-user"></i> Use Profile Address
        </button>
      </div>
      
      <div className="step-buttons">
        <button 
          type="button" 
          className="back-button"
          onClick={handlePrevStep}
        >
          Back
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={handleNextStep}
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default LocationForm;