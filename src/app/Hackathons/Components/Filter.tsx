// src/pages/Components/Filter.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Filter as FilterIcon } from 'lucide-react';

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
  const [location, setLocation] = useState(locationFilter || '');
  const [virtual, setVirtual] = useState<string>(
    virtualFilter === null ? 'all' : virtualFilter ? 'yes' : 'no'
  );
  const [hybrid, setHybrid] = useState<string>(
    hybridFilter === null ? 'all' : hybridFilter ? 'yes' : 'no'
  );
  const [showFilters, setShowFilters] = useState(false);

  // Handle search on enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Trim the location to handle spaces-only input
    const trimmedLocation = location.trim();
    onFilterChange(
      trimmedLocation,
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

  // Clear search input
  const clearSearch = () => {
    setLocation('');
    // Only reset the location filter while preserving other filters
    onFilterChange('', virtualFilter, hybridFilter);
  };

  // Automatically apply filters when dropdown selections change
  useEffect(() => {
    onFilterChange(
      location.trim(),
      virtual === 'all' ? null : virtual === 'yes',
      hybrid === 'all' ? null : hybrid === 'yes'
    );
  }, [virtual, hybrid]);

  // Ensure our component updates if parent changes props
  useEffect(() => {
    if (locationFilter !== location) {
      setLocation(locationFilter || '');
    }
    
    const virtualState = virtualFilter === null ? 'all' : virtualFilter ? 'yes' : 'no';
    if (virtualState !== virtual) {
      setVirtual(virtualState);
    }
    
    const hybridState = hybridFilter === null ? 'all' : hybridFilter ? 'yes' : 'no';
    if (hybridState !== hybrid) {
      setHybrid(hybridState);
    }
  }, [locationFilter, virtualFilter, hybridFilter]);

  return (
    <div className="mb-8">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300 transition-all">
          <div className="pl-4 text-gray-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by city, state, or country..."
            className="w-full py-3 px-2 text-gray-700 leading-tight focus:outline-none rounded-l-lg"
            aria-label="Location search"
          />
          {location && (
            <button 
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 flex items-center justify-center border-l border-gray-300 hover:bg-gray-100 rounded-r-lg transition-colors ${showFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
            aria-label="Show filters"
          >
            <FilterIcon size={20} />
            <span className="ml-1 hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-4 bg-white p-5 rounded-lg shadow border border-gray-200 animate-fadeIn">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Advanced Filters</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Virtual filter */}
            <div>
              <label htmlFor="virtual" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                id="virtual"
                value={virtual}
                onChange={(e) => setVirtual(e.target.value)}
                className="w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Events</option>
                <option value="yes">Virtual Only</option>
                <option value="no">In-Person Only</option>
              </select>
            </div>
            
            {/* Hybrid filter */}
            <div>
              <label htmlFor="hybrid" className="block text-sm font-medium text-gray-700 mb-2">
                Hybrid Events
              </label>
              <select
                id="hybrid"
                value={hybrid}
                onChange={(e) => setHybrid(e.target.value)}
                className="w-full p-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="yes">Hybrid Only</option>
                <option value="no">Non-Hybrid Only</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-blue-600 border border-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(locationFilter || virtualFilter !== null || hybridFilter !== null) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 mr-1">Active filters:</span>
          
          {locationFilter && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
              <MapPin size={14} className="mr-1" />
              {locationFilter}
              <button 
                onClick={() => onFilterChange('', virtualFilter, hybridFilter)} 
                className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                aria-label="Remove location filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {virtualFilter !== null && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
              {virtualFilter ? 'Virtual' : 'In-Person'}
              <button 
                onClick={() => onFilterChange(locationFilter, null, hybridFilter)} 
                className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                aria-label="Remove virtual filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {hybridFilter !== null && (
            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">
              {hybridFilter ? 'Hybrid' : 'Non-Hybrid'}
              <button 
                onClick={() => onFilterChange(locationFilter, virtualFilter, null)} 
                className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                aria-label="Remove hybrid filter"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {(locationFilter || virtualFilter !== null || hybridFilter !== null) && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors ml-2"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;