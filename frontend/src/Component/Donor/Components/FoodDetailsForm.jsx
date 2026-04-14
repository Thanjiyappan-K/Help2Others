import React from 'react';

const FoodDetailsForm = ({ 
  formData, 
  errors, 
  handleInputChange, 
  foodTypes, 
  getUnitSuggestions, 
  handleNextStep 
}) => {
  return (
    <div className="step-form food-details">
      <h3 className="step-title">Food Details</h3>
      
      <div className="form-group">
        <label htmlFor="foodType">Food Type*</label>
        <input
          list="foodTypeList"
          id="foodType"
          name="foodType"
          value={formData.foodType}
          onChange={handleInputChange}
          placeholder="Select or type food category"
          className={errors.foodType ? 'error' : ''}
        />
        <datalist id="foodTypeList">
          {foodTypes.map((type, index) => (
            <option key={index} value={type} />
          ))}
        </datalist>
        {errors.foodType && <div className="error-message">{errors.foodType}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the food items"
          rows="3"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="quantity">Quantity*</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter amount"
            min="1"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <div className="error-message">{errors.quantity}</div>}
        </div>
        
        <div className="form-group half">
          <label htmlFor="unit">Unit*</label>
          <input
            list="unitList"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            placeholder="Select unit"
            className={errors.unit ? 'error' : ''}
          />
          <datalist id="unitList">
            {formData.foodType && getUnitSuggestions(formData.foodType).map((unit, index) => (
              <option key={index} value={unit} />
            ))}
          </datalist>
          {errors.unit && <div className="error-message">{errors.unit}</div>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="image">Add Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          className="file-input"
        />
        <div className="file-upload-btn">
          <i className="fas fa-camera"></i> Upload Photo
        </div>
        {formData.image && <div className="image-preview-name">{formData.image.name}</div>}
      </div>
      
      <div className="step-buttons">
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

export default FoodDetailsForm;