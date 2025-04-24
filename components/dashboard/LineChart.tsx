import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export function LineChart({ data }: LineChartProps) {
  const { theme } = useTheme();

  // Base colors that work in both themes
  const baseOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151', // gray-200 / gray-700
          font: {
            family: 'Inter, sans-serif',
          },
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', // gray-800 / white
        titleColor: theme === 'dark' ? '#f3f4f6' : '#111827', // gray-100 / gray-900
        bodyColor: theme === 'dark' ? '#d1d5db' : '#4b5563', // gray-300 / gray-600
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db', // gray-600 / gray-300
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color:
            theme === 'dark'
              ? 'rgba(75, 85, 99, 0.3)'
              : 'rgba(209, 213, 219, 0.5)', // gray-600 / gray-300
          // borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db', // gray-600 / gray-300
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
        },
      },
      y: {
        beginAtZero: true,
        max: 600,
        grid: {
          color:
            theme === 'dark'
              ? 'rgba(75, 85, 99, 0.3)'
              : 'rgba(209, 213, 219, 0.5)', // gray-600 / gray-300
          // borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db', // gray-600 / gray-300
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280', // gray-400 / gray-500
          stepSize: 100,
        },
      },
    },
  };

  // Adjust dataset colors for dark mode if needed
  const themedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor:
        theme === 'dark'
          ? dataset.borderColor.replace('500', '400') // Lighten colors in dark mode
          : dataset.borderColor,
      backgroundColor:
        theme === 'dark'
          ? dataset.backgroundColor.replace('500', '400') // Lighten colors in dark mode
          : dataset.backgroundColor,
    })),
  };

  return (
    <div className='h-[400px] w-full'>
      <Line options={baseOptions} data={themedData} />
    </div>
  );
}
