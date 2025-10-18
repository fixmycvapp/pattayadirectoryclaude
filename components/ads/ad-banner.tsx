"use client";

import AdSlot from "./ad-slot";
import { cn } from "@/lib/utils";

interface AdBannerProps {
  position: 'header' | 'footer';
  page?: string;
  category?: string;
  className?: string;
}

export default function AdBanner({
  position,
  page,
  category,
  className,
}: AdBannerProps) {
  return (
    <div className={cn(
      "w-full py-4 bg-gray-50 border-y border-gray-200",
      className
    )}>
      <div className="container-custom">
        <AdSlot
          position={position}
          page={page}
          category={category}
          showLabel
          className="flex justify-center"
        />
      </div>
    </div>
  );
}