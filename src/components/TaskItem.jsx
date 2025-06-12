import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';

function TaskItem({ task, category, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    
    const dueDate = new Date(date);
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    return format(dueDate, 'MMM d');
  };

  const getDueDateColor = (date) => {
    if (!date) return 'text-gray-400';
    
    const dueDate = new Date(date);
    if (isPast(dueDate) && !isToday(dueDate)) return 'text-error';
    if (isToday(dueDate)) return 'text-warning';
    return 'text-gray-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-accent shadow-accent/20';
      case 'medium': return 'bg-warning shadow-warning/20';
      case 'low': return 'bg-info shadow-info/20';
      default: return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-surface rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer transition-shadow hover:shadow-md ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-success border-success text-white' 
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Priority Badge */}
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            
            {/* Task Title */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-transparent border-b border-primary focus:outline-none font-medium text-secondary"
                autoFocus
              />
            ) : (
              <h4
                onClick={() => !task.completed && setIsEditing(true)}
                className={`flex-1 font-medium break-words ${
                  task.completed 
                    ? 'line-through text-gray-400' 
                    : 'text-secondary hover:text-primary cursor-text'
                }`}
              >
                {task.title}
              </h4>
            )}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {/* Category */}
              {category && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color 
                  }}
                >
                  <ApperIcon name={category.icon} className="w-3 h-3" />
                  {category.name}
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span className={`flex items-center gap-1 ${getDueDateColor(task.dueDate)}`}>
                  <ApperIcon name="Calendar" className="w-3 h-3" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-primary rounded"
                title="Edit task"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-error rounded"
                title="Delete task"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskItem;