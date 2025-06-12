import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function CategoryItem({ category, isSelected, taskCount, onSelect, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Button
        onClick={() => onSelect(category.id)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
          isSelected 
            ? 'shadow-sm' 
            : 'hover:bg-gray-50'
        }`}
        style={{
          backgroundColor: isSelected 
            ? `${category.color}15` 
            : 'transparent',
          borderLeft: isSelected 
            ? `3px solid ${category.color}` 
            : 'none'
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
          {taskCount}
        </span>
      </Button>
    </motion.div>
  );
}

export default CategoryItem;