"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'footer' | 'inline' | 'event-detail';
  page?: string;
  category?: string;
  className?: string;
  showLabel?: boolean;
}

interface Ad {
  _id: string;
  title: string;
  type: 'image' | 'html' | 'video' | 'carousel';
  imageUrl?: string;
  imageUrlMobile?: string;
  targetUrl?: string;
  htmlContent?: string;
  altText?: string;
  displaySettings?: {
    width?: string;
    height?: string;
    animation?: 'none' | 'fade' | 'slide' | 'zoom';
  };
}

export default function AdSlot({
  position,
  page,
  category,
  className,
  showLabel = false,
}: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [impressionRecorded, setImpressionRecorded] = useState(false);

  useEffect(() => {
    fetchAd();
  }, [position, page, category]);

  useEffect(() => {
    if (ad && !impressionRecorded) {
      recordImpression();
      setImpressionRecorded(true);
    }
  }, [ad]);

  const fetchAd = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        ...(page && { page }),
        ...(category && { category }),
      });

      const response = await fetch(
        `${apiUrl}/ads/position/${position}?${params.toString()}`,
        { cache: 'no-store' }
      );

      if (response.ok) {
        const data = await response.json();
        setAd(data.data);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordImpression = async () => {
    if (!ad) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/ads/${ad._id}/impression`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error recording impression:', error);
    }
  };

  const handleClick = async () => {
    if (!ad || !ad.targetUrl) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/ads/${ad._id}/click`, {
        method: 'POST',
      });

      // Open link
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error recording click:', error);
    }
  };

  const getAnimationVariants = () => {
    const animation = ad?.displaySettings?.animation || 'none';

    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide':
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 },
        };
      case 'zoom':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      default:
        return {};
    }
  };

  if (loading || !ad || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        {...getAnimationVariants()}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative overflow-hidden",
          className
        )}
      >
        {/* Ad Label */}
        {showLabel && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-gray-900/70 text-white text-xs px-2 py-1 rounded">
              Advertisement
            </span>
          </div>
        )}

        {/* Close Button (for popup ads) */}
        {position === 'popup' && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close ad"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Image Ad */}
        {ad.type === 'image' && ad.imageUrl && (
          <div
            onClick={handleClick}
            className={cn(
              "cursor-pointer group",
              ad.displaySettings?.width && `w-[${ad.displaySettings.width}]`,
              ad.displaySettings?.height && `h-[${ad.displaySettings.height}]`
            )}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={ad.imageUrl}
                alt={ad.altText || ad.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* HTML Ad */}
        {ad.type === 'html' && ad.htmlContent && (
          <div
            dangerouslySetInnerHTML={{ __html: ad.htmlContent }}
            className="ad-html-content"
          />
        )}

        {/* Fallback */}
        {!ad.imageUrl && !ad.htmlContent && (
          <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
            <p className="text-sm">Advertisement</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}