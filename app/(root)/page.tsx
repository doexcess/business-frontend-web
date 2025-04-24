'use client';
import React from 'react';

const Home = () => {
  return (
    <main className='section-container'>
      <div className='flex h-screen'>
        {/* Main Content */}
        <div className='flex-1 text-black-1 dark:text-white'>
          <header className='flex justify-between items-center'>
            <h2 className='text-2xl font-semibold'>Hello, John 👋🏼</h2>
          </header>
        </div>
      </div>
    </main>
  );
};

export default Home;
