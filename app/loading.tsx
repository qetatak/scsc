import { Skeleton } from '@/components/ui/skeleton';

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Skeleton className="h-7 w-40 rounded-[10px]" />
        <Skeleton className="h-10 w-72 rounded-[10px]" />
        <Skeleton className="h-4 w-56 rounded-[8px]" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-24 rounded-[16px]" />
        <Skeleton className="h-24 rounded-[16px]" />
        <Skeleton className="h-24 rounded-[16px]" />
        <Skeleton className="h-24 rounded-[16px]" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-52 rounded-[16px]" />
        <Skeleton className="h-52 rounded-[16px]" />
      </div>
    </div>
  );
}
