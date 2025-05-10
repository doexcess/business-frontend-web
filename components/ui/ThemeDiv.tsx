import { cn } from '@/lib/utils';
import React from 'react';

const ThemeDiv = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) => {
  return (
    <div
      className={cn('text-gray-700 dark:text-white', className && className)}
    >
      {children}
    </div>
  );
};

export default ThemeDiv;
