import React from "react";
import { Skeleton } from "./skeleton";

type SkeletonArrayProps = {
  count?: number;
};

export const SkeletonArray: React.FC<SkeletonArrayProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-full h-32 bg-gray-300 animate-pulse rounded-md" />
      ))}
    </>
  );
};
