"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { EventDetail } from "@/lib/types";

interface EventMediaProps {
  event: EventDetail;
}

export default function EventMedia({ event }: EventMediaProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const images = event.images || [];
  const hasVideo = !!event.videoUrl;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-purple-600" />
        </div>
        Media Gallery
      </h2>

      {/* Video Section */}
      {hasVideo && (
        <div className="mb-6">
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group">
            {!showVideo ? (
              <>
                <Image
                  src={images[0] || event.imageUrl || ''}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play className="w-10 h-10 text-blue-600 ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <iframe
                src={event.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Photos ({images.length})
          </h3>
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
              <Image
                src={images[currentImageIndex]}
                alt={`Event photo ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-blue-600 scale-105'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}