import { cn, PurchaseItemType } from '@/lib/utils';
import Icon from '../ui/Icon';

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: string;
  type: PurchaseItemType;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (true) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
        <Icon url='/icons/landing/calendar-check.svg' width={48} height={48} />
        <p className='mt-3 text-base font-medium'>No recent activity</p>
        <p className='text-xs'>Your recent activity will appear here.</p>
      </div>
    );
  }
  return (
    <div className='space-y-4'>
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={cn(
            'flex items-start gap-3',
            activities.length - 1 !== index && 'border-b pt-1 pb-2'
          )}
        >
          <div className='mt-1 flex-shrink-0'>
            <Icon
              url={cn(
                '',
                activity.type === PurchaseItemType.SUBSCRIPTION &&
                  '/icons/landing/credit-card.svg',
                activity.type === PurchaseItemType.COURSE &&
                  '/icons/landing/calendar-check.svg',
                activity.type === PurchaseItemType.TICKET &&
                  '/icons/landing/notebook.svg'
              )}
              width={45}
              height={45}
            />
          </div>
          <div>
            <p className='text-sm font-medium'>{activity.title}</p>
            <p className='text-xs'>{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
