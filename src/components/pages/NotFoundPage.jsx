import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

function NotFoundPage() {
  return (
    <div className="h-full flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h1 className="mt-4 text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-2 text-xl font-medium text-secondary">Page not found</h2>
        <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Tasks
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;