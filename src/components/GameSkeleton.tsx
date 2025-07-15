// components/skeletons/GameSkeleton.tsx
"use client"

import { Skeleton } from "@/components/ui/skeleton";

export default function GameSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 lg:grid lg:grid-cols-3 lg:auto-rows-auto">
      <Skeleton className="h-64 w-full lg:col-span-3" />
      <div className="flex flex-col gap-2 lg:col-span-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-32 w-full mt-4" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
