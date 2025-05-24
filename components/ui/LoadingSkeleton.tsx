interface LoadingSkeletonSchema {
  length?: number;
}
const columns = Math.floor(100 / 10);

const LoadingSkeleton = ({ length = columns }: LoadingSkeletonSchema) => {
  return (
    <tbody className='w-full border'>
      {Array.from({ length }).map((_, index) => (
        <tr
          key={index}
          className='animate-pulse bg-gray-100 dark:bg-gray-800 w-full'
        >
          {Array.from({ length: columns }).map((_, index) => (
            <td key={index} className='px-6 py-3'>
              <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-[10vw]'></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default LoadingSkeleton;
