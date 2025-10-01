import React, { useState } from 'react';

const CurrencySwitcher = () => {
  const [currency, setCurrency] = useState('NGN');

  return (
    <div className='mx-2'>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className='border rounded-md px-2 py-1 text-sm dark:bg-gray-800 dark:text-white'
      >
        {['NGN', 'USD', 'GBP'].map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;
