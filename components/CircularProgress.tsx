interface CircularProgressProps {
  percentage: number;
}
const CircularProgress = ({ percentage }: CircularProgressProps) => {
  const strokeDashoffset = 100 - percentage;

  return (
    <div className='relative w-12 h-12'>
      <svg className='w-full h-full' viewBox='0 0 36 36'>
        {/* Background circle */}
        <path
          d='M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831'
          fill='none'
          stroke='#E5E5E7'
          strokeWidth='2'
        />
        {/* Progress circle */}
        <path
          d='M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831'
          fill='none'
          stroke='#0071E3'
          strokeWidth='2'
          strokeDasharray='100, 100'
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium'>
        {Number(percentage)}%
      </span>
    </div>
  );
};

export default CircularProgress;
