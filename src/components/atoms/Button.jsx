import { motion } from 'framer-motion';

function Button({ children, className = '', whileHover, whileTap, ...props }) {
  return (
    <motion.button
      whileHover={whileHover || { scale: 1.05 }}
      whileTap={whileTap || { scale: 0.95 }}
      className={`transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;