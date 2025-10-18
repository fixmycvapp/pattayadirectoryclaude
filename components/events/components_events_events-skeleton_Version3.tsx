import { Skeleton } from "@/components/ui/skeleton";

interface EventsSkeletonProps {
  count?: number;
}

export default function EventsSkeleton({ count = 12 }: EventsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
          <Skeleton className="h-48 w-full" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex justify-between items-center pt-4 border-t">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}