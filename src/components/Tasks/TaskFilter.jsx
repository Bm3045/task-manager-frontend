import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const TaskFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tasks by title..."
            className="input-field pl-10"
          />
        </form>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field pl-10 appearance-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              setFilters({ status: '', search: '' });
              onFilterChange({ status: '', search: '' });
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;