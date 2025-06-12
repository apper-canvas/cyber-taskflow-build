import { useState, useEffect, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { taskService, categoryService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

// Organisms
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskDashboardHeader from '@/components/organisms/TaskDashboardHeader';
import TaskList from '@/components/organisms/TaskList';
import AddTaskForm from '@/components/organisms/AddTaskForm';
import Button from '@/components/atoms/Button';
function HomePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);
useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated]);

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        order: tasks.length
      });
      setTasks(prev => [...prev, newTask]);
      setShowAddForm(false);
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      
      if (updates.completed) {
        toast.success('Task completed! 🎉');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create({
        ...categoryData,
        order: categories.length
      });
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added!');
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  const handleReorderTasks = async (reorderedTasks) => {
    setTasks(reorderedTasks);
    
    try {
      await Promise.all(
        reorderedTasks.map((task, index) =>
          taskService.update(task.id, { order: index })
        )
      );
    } catch (err) {
      toast.error('Failed to save task order');
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategoryId === 'all' || task.categoryId === selectedCategoryId;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'pending' && !task.completed);
    
    return matchesCategory && matchesSearch && matchesPriority && matchesStatus;
  }).sort((a, b) => a.order - b.order);

  // Calculate completion rate
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-80 bg-white border-r border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary mb-2">Unable to load tasks</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </Button>
</div>
      </div>
    );
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-full flex max-w-full overflow-hidden">
      {/* Category Sidebar */}
      <CategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onAddCategory={handleAddCategory}
        tasks={tasks}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <TaskDashboardHeader
          completionRate={completionRate}
          completedTasks={completedTasksCount}
          totalTasks={totalTasksCount}
          onAddTaskClick={() => setShowAddForm(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <AddTaskForm
                  categories={categories}
                  onSubmit={handleAddTask}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;