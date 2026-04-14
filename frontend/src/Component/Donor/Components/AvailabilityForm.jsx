import React from 'react';

const AvailabilityForm = ({ 
  formData, 
  errors, 
  handleInputChange, 
  handleNextStep, 
  handlePrevStep 
}) => {
  return (
    <div className="step-form availability">
      <h3 className="step-title">Availability</h3>
      
      <div className="form-group">
        <label>Expiry Date & Time*</label>
        <div className="form-row">
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className={`half ${errors.expiryDate ? 'error' : ''}`}
          />
          <input
            type="time"
            name="expiryTime"
            value={formData.expiryTime}
            onChange={handleInputChange}
            className="half"
          />
        </div>
        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
      </div>
      
      <div className="form-group">
        <label>Pickup Window Start*</label>
        <div className="form-row">
          <input
            type="date"
            name="pickupStartDate"
            value={formData.pickupStartDate}
            onChange={handleInputChange}
            className="half"
          />
          <input
            type="time"
            name="pickupStartTime"
            value={formData.pickupStartTime}
            onChange={handleInputChange}
            className="half"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Pickup Window End*</label>
        <div className="form-row">
          <input
            type="date"
            name="pickupEndDate"
            value={formData.pickupEndDate}
            onChange={handleInputChange}
            className={`half ${errors.pickupEndDate ? 'error' : ''}`}
          />
          <input
            type="time"
            name="pickupEndTime"
            value={formData.pickupEndTime}
            onChange={handleInputChange}
            className={`half ${errors.pickupEndTime ? 'error' : ''}`}
          />
        </div>
        {errors.pickupEndDate && <div className="error-message">{errors.pickupEndDate}</div>}
        {errors.pickupEndTime && <div className="error-message">{errors.pickupEndTime}</div>}
      </div>
      
      <div className="form-group checkbox-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="isRecurring"
            checked={formData.isRecurring}
            onChange={handleInputChange}
          />
          <span className="checkmark"></span>
          Make this a recurring donation
        </label>
      </div>
      
      {formData.isRecurring && (
        <div className="form-group">
          <label htmlFor="recurringFrequency">Frequency</label>
          <select
            id="recurringFrequency"
            name="recurringFrequency"
            value={formData.recurringFrequency}
            onChange={handleInputChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}
      
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
          Next
        </button>
      </div>
    </div>
  );
};

export default AvailabilityForm;