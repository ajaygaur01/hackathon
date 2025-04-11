// src/pages/Components/Filter.tsx
import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (location: string, virtual: boolean | null, hybrid: boolean | null) => void;
  locationFilter: string;
  virtualFilter: boolean | null;
  hybridFilter: boolean | null;
}

const Filter: React.FC<FilterProps> = ({ 
  onFilterChange, 
  locationFilter, 
  virtualFilter, 
  hybridFilter 
}) => {
  // Local state to manage form inputs
  const [location, setLocation] = useState(locationFilter);
  const [virtual, setVirtual] = useState<string>(
    virtualFilter === null ? 'all' : virtualFilter ? 'yes' : 'no'
  );
  const [hybrid, setHybrid] = useState<string>(
    hybridFilter === null ? 'all' : hybridFilter ? 'yes' : 'no'
  );

  // Apply filters
  const applyFilters = () => {
    onFilterChange(
      location,
      virtual === 'all' ? null : virtual === 'yes',
      hybrid === 'all' ? null : hybrid === 'yes'
    );
  };

  // Reset filters
  const resetFilters = () => {
    setLocation('');
    setVirtual('all');
    setHybrid('all');
    onFilterChange('', null, null);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Filter Hackathons</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Location filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state, or country"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        {/* Virtual filter */}
        <div>
          <label htmlFor="virtual" className="block text-sm font-medium text-gray-700 mb-1">
            Virtual Events
          </label>
          <select
            id="virtual"
            value={virtual}
            onChange={(e) => setVirtual(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="yes">Virtual Only</option>
            <option value="no">In-Person Only</option>
          </select>
        </div>
        
        {/* Hybrid filter */}
        <div>
          <label htmlFor="hybrid" className="block text-sm font-medium text-gray-700 mb-1">
            Hybrid Events
          </label>
          <select
            id="hybrid"
            value={hybrid}
            onChange={(e) => setHybrid(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="all">All</option>
            <option value="yes">Hybrid Only</option>
            <option value="no">Non-Hybrid Only</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-4 justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Reset
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;