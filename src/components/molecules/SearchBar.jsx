import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  priorityFilter, 
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange 
}) {
  const [showFilters, setShowFilters] = useState(false);

  const clearAllFilters = () => {
    onSearchChange('');
    onPriorityFilterChange('all');
    onStatusFilterChange('all');
  };

  const hasActiveFilters = searchQuery || priorityFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
        />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="pl-10 pr-12 py-3 bg-white"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {searchQuery && (
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded transition-colors ${
              hasActiveFilters ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ApperIcon name="Filter" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-secondary">Filters</h4>
              {hasActiveFilters && (
                <Button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => onPriorityFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Search: "{searchQuery}"
                      <button onClick={() => onSearchChange('')}>
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {priorityFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Priority: {priorityFilter}
                      <button onClick={() => onPriorityFilterChange('all')}>
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Status: {statusFilter}
                      <button onClick={() => onStatusFilterChange('all')}>
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;