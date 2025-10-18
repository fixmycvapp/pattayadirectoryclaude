"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { EventDetail } from "@/lib/types";
import { format } from "date-fns";

interface EventHeroProps {
  event: EventDetail;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-gray-900">
      {/* Background Image */}
      {event.imageUrl && (
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white px-4 py-1.5 text-sm">
                {event.type}
              </Badge>
              <Badge variant="secondary" className="bg-blue-600/90 backdrop-blur-sm text-white hover:bg-blue-600 px-4 py-1.5 text-sm">
                {format(new Date(event.date), "MMM dd, yyyy")}
              </Badge>
              {event.featured && (
                <Badge className="bg-orange-500/90 backdrop-blur-sm text-white hover:bg-orange-500 px-4 py-1.5 text-sm">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 max-w-5xl leading-tight">
              {event.title}
            </h1>

            {/* Location */}
            <p className="text-xl md:text-2xl text-blue-100 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {event.location}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { MapPin } from "lucide-react";