import React from 'react';

const Checkbox = ({
  type,
  name,
  placeholder = '',
  className = 'w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600',
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        aria-describedby={name}
        name={name}
        id={name}
        className={className}
        placeholder={placeholder}
        required
      />
    </>
  );
};

export default Checkbox;
