import Image from 'next/image';
import React from 'react';

interface IconProps {
  url: string;
}
const Icon = ({ url }: IconProps) => {
  return (
    <>
      <Image src={url} width={20} height={20} alt='icon' objectFit='contain' />
    </>
  );
};

export default Icon;
