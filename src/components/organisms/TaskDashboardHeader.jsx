import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';

function TaskDashboardHeader({ 
  completionRate, 
  completedTasks, 
  totalTasks, 
  onAddTaskClick,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange
}) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-secondary">
            TaskFlow
          </h1>
          <ProgressRing
            percentage={completionRate}
            size={40}
            strokeWidth={4}
          />
          <span className="text-sm text-gray-500">
            {completedTasks}/{totalTasks} completed
          </span>
        </div>
        
        <Button
          onClick={onAddTaskClick}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          Add Task
        </Button>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={onPriorityFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
      />
    </div>
  );
}

export default TaskDashboardHeader;