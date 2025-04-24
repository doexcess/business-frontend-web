interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className='space-y-4'>
      {activities.map((activity) => (
        <div key={activity.id} className='flex items-start gap-3'>
          <div className='mt-1 flex-shrink-0'>{activity.icon}</div>
          <div>
            <p className='text-sm font-medium text-gray-900'>
              {activity.title}
            </p>
            <p className='text-xs text-gray-500'>{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
