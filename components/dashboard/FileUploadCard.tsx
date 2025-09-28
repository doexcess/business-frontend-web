import React, { useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {
  preview: string | null;
  fileName?: string | null;
  uploading: boolean;
  accept: string;
  onFileSelect: (file: File) => void;
  placeholder: {
    icon: string;
    title: string;
    description: string;
  };
};

const FileUploadCard: React.FC<Props> = ({
  preview,
  fileName,
  uploading,
  accept,
  onFileSelect,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className='flex flex-col gap-2'>
      <div
        className='relative flex flex-col items-center justify-center w-full sm:w-72 h-56 rounded-md border-2 border-dashed border-primary-main bg-primary-main/10 text-center cursor-pointer overflow-hidden'
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt='Preview'
              className='w-full h-full object-cover rounded-md'
            />
          </>
        ) : (
          <>
            <img
              src={placeholder.icon}
              alt='upload icon'
              className='mb-2 w-10 opacity-80'
            />
            <p className='font-medium'>{placeholder.title}</p>
            <p className='text-xs mt-1'>{placeholder.description}</p>
          </>
        )}

        {uploading && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center text-white'>
            Uploading...
          </div>
        )}

        <input
          type='file'
          hidden
          ref={inputRef}
          accept={accept}
          onChange={handleChange}
        />
      </div>
      {fileName && (
        <Link href={fileName}>
          <Badge>{fileName.split('/')[fileName.split('/').length - 1]}</Badge>
        </Link>
      )}
    </div>
  );
};

export default FileUploadCard;
