import React from 'react';

const Input = ({
  id,
  type,
  name,
  placeholder = '',
  className = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
  onChange,
  value,
  defaultValue,
  required,
  readonly = false,
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        name={name}
        id={id}
        className={className}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
        required={required}
        {...(readonly ? { readOnly: true } : {})}
      />
    </>
  );
};

export default Input;
