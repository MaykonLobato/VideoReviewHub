import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function VideoCardSkeleton() {
  return (
    <Card className='overflow-hidden'>
      <div className='relative aspect-video'>
        <Skeleton className='w-full h-full' />
      </div>
      <div className='p-6 space-y-4'>
        <Skeleton className='h-6 w-3/4' />
        <div className='flex gap-2'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-20' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-6 w-16' />
          <Skeleton className='h-6 w-24' />
        </div>
      </div>
    </Card>
  );
}
