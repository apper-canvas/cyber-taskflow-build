import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

function CategorySidebar({ categories, selectedCategoryId, onSelectCategory, onAddCategory, tasks }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Folder');
  const [newCategoryColor, setNewCategoryColor] = useState('#5B67CA');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        icon: newCategoryIcon,
        color: newCategoryColor
      });
      setNewCategoryName('');
      setNewCategoryIcon('Folder');
      setNewCategoryColor('#5B67CA');
      setShowAddForm(false);
    }
  };

  const getTaskCount = (categoryId) => {
    if (categoryId === 'all') return tasks.length;
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const iconOptions = [
    'Folder', 'Briefcase', 'Home', 'ShoppingCart', 'Heart', 
    'Star', 'BookOpen', 'Coffee', 'Car', 'Gamepad2'
  ];

  const colorOptions = [
    '#5B67CA', '#FF6B6B', '#4ECDC4', '#FFE66D', '#4D96FF',
    '#A78BFA', '#F472B6', '#FB7185', '#34D399', '#FBBF24'
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-heading font-semibold text-secondary mb-4">
          Categories
        </h2>
        
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectCategory('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors mb-2 ${
            selectedCategoryId === 'all' 
              ? 'bg-primary text-white shadow-sm' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="List" className="w-4 h-4" />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            selectedCategoryId === 'all' 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getTaskCount('all')}
          </span>
        </motion.button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedCategoryId === category.id 
                    ? 'shadow-sm' 
                    : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: selectedCategoryId === category.id 
                    ? `${category.color}15` 
                    : 'transparent',
                  borderLeft: selectedCategoryId === category.id 
                    ? `3px solid ${category.color}` 
                    : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  <ApperIcon 
                    name={category.icon} 
                    className="w-4 h-4" 
                    style={{ color: category.color }}
                  />
                  <span className="font-medium text-secondary break-words">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {getTaskCount(category.id)}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Category Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center gap-3 p-3 mt-4 rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span className="font-medium">Add Category</span>
        </motion.button>

        {/* Add Category Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddCategory}
              className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3"
            >
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              
              {/* Icon Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewCategoryIcon(icon)}
                      className={`p-2 rounded-lg border transition-colors ${
                        newCategoryIcon === icon 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ApperIcon name={icon} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                        newCategoryColor === color 
                          ? 'border-gray-400 scale-110' 
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CategorySidebar;