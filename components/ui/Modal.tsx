// components/ui/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeIn'>
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl'
          >
            &times;
          </button>
        </div>
        <div className='px-6 py-5'>{children}</div>
      </div>
    </div>
  );
};
