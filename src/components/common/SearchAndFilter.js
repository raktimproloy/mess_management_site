'use client'
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const SearchAndFilter = ({
  filters = {},
  onFiltersChange,
  onSearch,
  searchPlaceholder = "Search...",
  filterConfig = [],
  showClearButton = true,
  className = ""
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      onSearch?.(term);
    }, 300),
    [onSearch]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Clear all filters and search
  const handleClearAll = () => {
    setLocalFilters({});
    setSearchTerm('');
    onFiltersChange?.({});
    onSearch?.('');
  };

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Render filter input based on type
  const renderFilterInput = (filter) => {
    const { key, label, type, placeholder, options = [], min, max, step } = filter;
    const value = localFilters[key] || '';

    switch (type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              handleFilterChange(key, selectedOptions);
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white min-h-[42px]"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder={placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            min={min}
            max={max}
            step={step}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder={placeholder}
          />
        );

      case 'range':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              value={value?.min || ''}
              onChange={(e) => handleFilterChange(key, { ...value, min: e.target.value })}
              min={min}
              max={max}
              step={step}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Min"
            />
            <input
              type="number"
              value={value?.max || ''}
              onChange={(e) => handleFilterChange(key, { ...value, max: e.target.value })}
              min={min}
              max={max}
              step={step}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Max"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder={searchPlaceholder}
        />
      </div>

      {/* Filters */}
      {filterConfig.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-200 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filterConfig.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Button */}
      {showClearButton && (Object.keys(localFilters).some(key => localFilters[key]) || searchTerm) && (
        <div className="flex justify-end">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
