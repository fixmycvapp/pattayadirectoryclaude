import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[70vh] min-h-[500px]" />

      {/* Content Skeleton */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Info Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <Skeleton className="w-12 h-12 rounded-xl mb-3" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Map Skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <Skeleton className="h-8 w-40 mb-6" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Skeleton className="h-12 w-32 mb-6" />
              <Skeleton className="h-14 w-full mb-3" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}