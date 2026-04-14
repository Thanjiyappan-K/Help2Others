// components/steps/CapacityInfo.js
import React from 'react';

const CapacityInfo = ({ formData, handleChange }) => {
  return (
    <div className="form-step">
      <h3>Capacity Information</h3>
      
      <div className="form-group">
        <label htmlFor="totalCapacity">Total Capacity*</label>
        <input
          type="number"
          id="totalCapacity"
          name="totalCapacity"
          value={formData.totalCapacity}
          onChange={handleChange}
          required
          min="1"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="currentOccupancy">Current Occupancy*</label>
        <input
          type="number"
          id="currentOccupancy"
          name="currentOccupancy"
          value={formData.currentOccupancy}
          onChange={handleChange}
          required
          min="0"
          max={formData.totalCapacity || 9999}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="maleCount">Male Count</label>
          <input
            type="number"
            id="maleCount"
            name="maleCount"
            value={formData.maleCount}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group half">
          <label htmlFor="femaleCount">Female Count</label>
          <input
            type="number"
            id="femaleCount"
            name="femaleCount"
            value={formData.femaleCount}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group third">
          <label htmlFor="childrenCount">Children</label>
          <input
            type="number"
            id="childrenCount"
            name="childrenCount"
            value={formData.childrenCount}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group third">
          <label htmlFor="elderlyCount">Elderly</label>
          <input
            type="number"
            id="elderlyCount"
            name="elderlyCount"
            value={formData.elderlyCount}
            onChange={handleChange}
            min="0"
          />
        </div>
        
        <div className="form-group third">
          <label htmlFor="specialNeedsCount">Special Needs</label>
          <input
            type="number"
            id="specialNeedsCount"
            name="specialNeedsCount"
            value={formData.specialNeedsCount}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default CapacityInfo;