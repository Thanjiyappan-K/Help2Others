// components/steps/FoodNeeds.js
import React from 'react';

const FoodNeeds = ({ formData, handleChange }) => {
  return (
    <div className="form-step">
      <h3>Food Needs</h3>
      
      <div className="form-group checkbox-group">
        <label>Meal Types Required</label>
        <div className="checkbox-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="mealTypes.breakfast"
              checked={formData.mealTypes.breakfast}
              onChange={handleChange}
            />
            Breakfast
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="mealTypes.lunch"
              checked={formData.mealTypes.lunch}
              onChange={handleChange}
            />
            Lunch
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="mealTypes.dinner"
              checked={formData.mealTypes.dinner}
              onChange={handleChange}
            />
            Dinner
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="mealTypes.snacks"
              checked={formData.mealTypes.snacks}
              onChange={handleChange}
            />
            Snacks
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="frequencyOfSupply">Frequency of Supply</label>
        <select
          id="frequencyOfSupply"
          name="frequencyOfSupply"
          value={formData.frequencyOfSupply}
          onChange={handleChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="oneTime">One-time</option>
        </select>
      </div>
      
      <div className="form-group checkbox-group">
        <label>Dietary Restrictions</label>
        <div className="checkbox-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="dietaryRestrictions.vegetarian"
              checked={formData.dietaryRestrictions.vegetarian}
              onChange={handleChange}
            />
            Vegetarian
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="dietaryRestrictions.vegan"
              checked={formData.dietaryRestrictions.vegan}
              onChange={handleChange}
            />
            Vegan
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="dietaryRestrictions.glutenFree"
              checked={formData.dietaryRestrictions.glutenFree}
              onChange={handleChange}
            />
            Gluten-free
          </label>
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="dietaryRestrictions.diabetic"
              checked={formData.dietaryRestrictions.diabetic}
              onChange={handleChange}
            />
            Diabetic
          </label>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="dietaryRestrictions.other">Other Dietary Requirements</label>
        <textarea
          id="dietaryRestrictions.other"
          name="dietaryRestrictions.other"
          value={formData.dietaryRestrictions.other}
          onChange={handleChange}
          rows="2"
        />
      </div>
    </div>
  );
};

export default FoodNeeds;