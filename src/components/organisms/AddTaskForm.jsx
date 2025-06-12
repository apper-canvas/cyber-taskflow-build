import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

function AddTaskForm({ categories, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        priority,
        categoryId: categoryId || null,
        dueDate: dueDate || null,
        completed: false
      });
    }
  };

  const setQuickDate = (days) => {
    const date = addDays(new Date(), days);
    setDueDate(format(date, 'yyyy-MM-dd'));
  };

  return (
    <motion.div
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-secondary">
          Add New Task
        </h3>
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Task Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            required
          />
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'high', label: 'High', color: 'accent', icon: 'AlertCircle' },
              { value: 'medium', label: 'Medium', color: 'warning', icon: 'Circle' },
              { value: 'low', label: 'Low', color: 'info', icon: 'Minus' }
            ].map(({ value, label, color, icon }) => (
              <Button
                key={value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPriority(value)}
                className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 ${
                  priority === value
                    ? `border-${color} bg-${color}/10 text-${color}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Category (Optional)
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">No category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            Due Date (Optional)
          </label>
          
          {/* Quick Date Buttons */}
          <div className="flex gap-2 mb-2">
            {[
              { label: 'Today', days: 0 },
              { label: 'Tomorrow', days: 1 },
              { label: 'Next Week', days: 7 }
            ].map(({ label, days }) => (
              <Button
                key={label}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuickDate(days)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
              >
                {label}
              </Button>
            ))}
          </div>
          
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!title.trim()}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
            Add Task
          </Button>
          
          <Button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddTaskForm;