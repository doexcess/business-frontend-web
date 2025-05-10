import CircularProgress from '@/components/CircularProgress';
import ThemeDivBorder from '@/components/ui/ThemeDivBorder';
import Image from 'next/image';
import { Interface } from 'readline/promises';

interface CourseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  progress: number;
  price?: number;
}
const CourseCard = ({
  title,
  description,
  imageSrc,
  progress,
  price,
}: CourseCardProps) => {
  return (
    <ThemeDivBorder className='flex-1 border border-[#E5E5E7] rounded-xl overflow-hidden flex h-full'>
      {/* Image container - fills left space */}
      <div className='relative w-1/3 min-w-[120px]'>
        <Image
          src={imageSrc}
          alt={title}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 33vw'
        />
      </div>

      {/* Content container - text and progress */}
      <div className='flex-1 p-4 flex flex-col justify-between'>
        <div>
          <h2 className='font-medium text-base leading-6 mb-1'>{title}</h2>
          <p className='text-[#86868B] text-sm leading-5 mb-3'>{description}</p>
        </div>

        <CircularProgress percentage={progress} />
      </div>
    </ThemeDivBorder>
  );
};

export default CourseCard;
