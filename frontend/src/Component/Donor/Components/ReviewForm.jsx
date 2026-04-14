import React from 'react';

const ReviewForm = ({ formData, isSubmitting, handleSubmit, handlePrevStep }) => {
  return (
    <div className="step-form review">
      <h3 className="step-title">Review & Submit</h3>
      
      <div className="review-section">
        <h4>Food Details</h4>
        <div className="review-item">
          <span className="label">Food Type:</span>
          <span>{formData.foodType}</span>
        </div>
        <div className="review-item">
          <span className="label">Description:</span>
          <span>{formData.description || 'Not provided'}</span>
        </div>
        <div className="review-item">
          <span className="label">Quantity:</span>
          <span>{formData.quantity} {formData.unit}</span>
        </div>
        {formData.image && (
          <div className="review-item">
            <span className="label">Image:</span>
            <span>{formData.image.name}</span>
          </div>
        )}
      </div>
      
      <div className="review-section">
        <h4>Availability</h4>
        <div className="review-item">
          <span className="label">Expiry:</span>
          <span>{formData.expiryDate} at {formData.expiryTime}</span>
        </div>
        <div className="review-item">
          <span className="label">Pickup Window:</span>
          <span>
            {formData.pickupStartDate} at {formData.pickupStartTime} to<br />
            {formData.pickupEndDate} at {formData.pickupEndTime}
          </span>
        </div>
        <div className="review-item">
          <span className="label">Recurring:</span>
          <span>{formData.isRecurring ? `Yes (${formData.recurringFrequency})` : 'No'}</span>
        </div>
      </div>
      
      <div className="review-section">
        <h4>Location</h4>
        <div className="review-item">
          <span className="label">Address:</span>
          <span>{formData.address}</span>
        </div>
        <div className="review-item">
          <span className="label">City:</span>
          <span>{formData.city}</span>
        </div>
        <div className="review-item">
          <span className="label">ZIP Code:</span>
          <span>{formData.zipCode}</span>
        </div>
        {formData.specialInstructions && (
          <div className="review-item">
            <span className="label">Instructions:</span>
            <span>{formData.specialInstructions}</span>
          </div>
        )}
      </div>
      
      <div className="step-buttons">
        <button 
          type="button" 
          className="back-button"
          onClick={handlePrevStep}
        >
          Edit
        </button>
        <button 
          type="submit" 
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Donation'}
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;