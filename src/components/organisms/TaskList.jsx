import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';
import ApperIcon from '@/components/ApperIcon';

function TaskList({ tasks, categories, onUpdateTask, onDeleteTask, onReorderTasks }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null);
      return;
    }

    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);
    
    // Remove dragged task and insert at target position
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);
    
    onReorderTasks(newTasks);
    setDraggedTask(null);
  };

  // Group tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium' && !task.completed);
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low' && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const TaskGroup = ({ title, tasks: groupTasks, priority }) => {
    if (groupTasks.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          {priority && (
            <div className={`w-2 h-2 rounded-full ${
              priority === 'high' ? 'bg-accent' :
              priority === 'medium' ? 'bg-warning' :
              priority === 'low' ? 'bg-info' : 'bg-gray-400'
            }`} />
          )}
          {title}
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {groupTasks.length}
          </span>
        </h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {groupTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                draggable={!task.completed}
                onDragStart={() => handleDragStart(task)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task)}
                className={`${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
              >
                <TaskItem
                  task={task}
                  category={categories.find(cat => cat.id === task.categoryId)}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-xl font-heading font-medium text-secondary">
          No tasks yet
        </h3>
        <p className="mt-2 text-gray-500">
          Create your first task to start being productive!
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-lg cursor-pointer"
        >
          <ApperIcon name="Plus" className="w-4 h-4 inline mr-2" />
          Add Your First Task
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-full">
      <TaskGroup 
        title="High Priority" 
        tasks={highPriorityTasks} 
        priority="high"
      />
      
      <TaskGroup 
        title="Medium Priority" 
        tasks={mediumPriorityTasks} 
        priority="medium"
      />
      
      <TaskGroup 
        title="Low Priority" 
        tasks={lowPriorityTasks} 
        priority="low"
      />
      
      {completedTasks.length > 0 && (
        <TaskGroup 
          title="Completed" 
          tasks={completedTasks}
        />
      )}
    </div>
  );
}

export default TaskList;