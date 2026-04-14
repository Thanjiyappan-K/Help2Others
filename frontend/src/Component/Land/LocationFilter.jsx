import React, { useState } from 'react';
import './LocationFilter.css';

const LocationFilter = ({ onFilterApply }) => {
  const [filters, setFilters] = useState({
    states: {
      Maharashtra: false,
      Karnataka: false,
      Gujarat: false,
      Delhi: false
    },
    districts: {
      Mumbai: false,
      Pune: false,
      Bangalore: false,
      Ahmedabad: false,
      'New Delhi': false
    },
    cities: {
      'Mumbai City': false,
      'Pune City': false,
      'Bangalore Urban': false,
      'Ahmedabad City': false,
      'Delhi Central': false
    }
  });

  // Sample data - in a real app, this would come from your database
  const sampleData = [
    { id: 1, name: "Hotel Taj", type: "donor", location: { state: "Maharashtra", district: "Mumbai", city: "Mumbai City" } },
    { id: 2, name: "Grand Hyatt", type: "donor", location: { state: "Maharashtra", district: "Mumbai", city: "Mumbai City" } },
    { id: 3, name: "Marriott", type: "donor", location: { state: "Karnataka", district: "Bangalore", city: "Bangalore Urban" } },
    { id: 4, name: "Sunshine NGO", type: "beneficiary", location: { state: "Maharashtra", district: "Pune", city: "Pune City" } },
    { id: 5, name: "Hope Foundation", type: "beneficiary", location: { state: "Gujarat", district: "Ahmedabad", city: "Ahmedabad City" } }
  ];

  const handleFilterChange = (category, item) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [item]: !prevFilters[category][item]
      }
    }));
  };

  const applyFilters = () => {
    // Check if any filters are selected
    const hasActiveFilters = Object.keys(filters).some(category => 
      Object.values(filters[category]).some(value => value)
    );

    if (!hasActiveFilters) {
      // If no filters are selected, return all data
      onFilterApply(sampleData);
      return;
    }

    // Filter the data based on selected criteria
    const filteredData = sampleData.filter(item => {
      // Check if this item matches any of the selected state filters
      const stateMatch = Object.keys(filters.states).some(state => 
        filters.states[state] && item.location.state === state
      );
      
      // Check if this item matches any of the selected district filters
      const districtMatch = Object.keys(filters.districts).some(district => 
        filters.districts[district] && item.location.district === district
      );
      
      // Check if this item matches any of the selected city filters
      const cityMatch = Object.keys(filters.cities).some(city => 
        filters.cities[city] && item.location.city === city
      );

      // If no filters in a category are selected, consider it a match for that category
      const noStateFilters = !Object.values(filters.states).some(v => v);
      const noDistrictFilters = !Object.values(filters.districts).some(v => v);
      const noCityFilters = !Object.values(filters.cities).some(v => v);

      // Item matches if it matches all selected filter categories
      return (stateMatch || noStateFilters) && 
             (districtMatch || noDistrictFilters) && 
             (cityMatch || noCityFilters);
    });

    onFilterApply(filteredData);
  };

  const resetFilters = () => {
    setFilters({
      states: Object.fromEntries(Object.keys(filters.states).map(key => [key, false])),
      districts: Object.fromEntries(Object.keys(filters.districts).map(key => [key, false])),
      cities: Object.fromEntries(Object.keys(filters.cities).map(key => [key, false]))
    });
    onFilterApply(sampleData);
  };

  return (
    <div className="location-filter">
      <h3 className="filter-title">Filter by Location</h3>
      
      <div className="filter-categories">
        <div className="filter-category">
          <h4>State</h4>
          {Object.keys(filters.states).map(state => (
            <div className="filter-item" key={state}>
              <input 
                type="checkbox" 
                id={`state-${state}`} 
                checked={filters.states[state]} 
                onChange={() => handleFilterChange('states', state)} 
              />
              <label htmlFor={`state-${state}`}>{state}</label>
            </div>
          ))}
        </div>
        
        <div className="filter-category">
          <h4>District</h4>
          {Object.keys(filters.districts).map(district => (
            <div className="filter-item" key={district}>
              <input 
                type="checkbox" 
                id={`district-${district}`} 
                checked={filters.districts[district]} 
                onChange={() => handleFilterChange('districts', district)} 
              />
              <label htmlFor={`district-${district}`}>{district}</label>
            </div>
          ))}
        </div>
        
        <div className="filter-category">
          <h4>City</h4>
          {Object.keys(filters.cities).map(city => (
            <div className="filter-item" key={city}>
              <input 
                type="checkbox" 
                id={`city-${city}`} 
                checked={filters.cities[city]} 
                onChange={() => handleFilterChange('cities', city)} 
              />
              <label htmlFor={`city-${city}`}>{city}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="btn filter-btn apply-btn" onClick={applyFilters}>Apply Filters</button>
        <button className="btn filter-btn reset-btn" onClick={resetFilters}>Reset</button>
      </div>
    </div>
  );
};

export default LocationFilter;