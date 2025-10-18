"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventGalleryProps {
  images: string[];
  title: string;
}

export default function EventGallery({ images, title }: EventGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <p className="text-gray-500 text-lg">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full h-full group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsFullscreen(true)}
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75 w-2"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto px-4">
              <Image
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-7 h-7 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-7 h-7 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}