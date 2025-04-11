// src/components/FilterOptions.tsx
import React, { useState } from 'react';

interface FilterOptionsProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  format: string[];
  location: string[];
  date: string[];
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    format: [],
    location: [],
    date: []
  });

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    const updatedFilters = { ...filters };
    
    if (updatedFilters[category].includes(value)) {
      // Remove the filter if already selected
      updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
    } else {
      // Add the filter
      updatedFilters[category] = [...updatedFilters[category], value];
    }
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Filter Events</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Format</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('format', 'In-Person')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.format.includes('In-Person')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                In-Person
              </button>
              <button
                onClick={() => handleFilterChange('format', 'Virtual')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.format.includes('Virtual')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Virtual
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Region</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('location', 'US')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.location.includes('US')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                US
              </button>
              <button
                onClick={() => handleFilterChange('location', 'APAC')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.location.includes('APAC')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                APAC
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Time</h4>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('date', 'Upcoming')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.date.includes('Upcoming')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleFilterChange('date', 'Past')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.date.includes('Past')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Past
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {(filters.format.length > 0 || filters.location.length > 0 || filters.date.length > 0) && (
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.format.map(format => (
              <span key={format} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {format}
                <button 
                  onClick={() => handleFilterChange('format', format)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.location.map(location => (
              <span key={location} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {location}
                <button 
                  onClick={() => handleFilterChange('location', location)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.date.map(date => (
              <span key={date} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {date}
                <button 
                  onClick={() => handleFilterChange('date', date)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button 
            onClick={() => {
              setFilters({ format: [], location: [], date: [] });
              onFilterChange({ format: [], location: [], date: [] });
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;