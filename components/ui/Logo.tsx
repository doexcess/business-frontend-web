import Image from 'next/image';
import React from 'react';

const Logo = ({
  width = 150,
  height = 120,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <>
      <Image
        src={'/logo.png'}
        width={width}
        height={height}
        alt='Doexcess Logo'
        className='mr-3 object-contain block dark:hidden'
      />
      <Image
        src={'/logo-white.png'}
        width={width}
        height={height}
        alt='Doexcess Logo'
        className='mr-3 object-contain hidden dark:block'
      />
    </>
  );
};

export default Logo;
