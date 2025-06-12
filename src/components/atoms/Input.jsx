function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
}

export default Input;