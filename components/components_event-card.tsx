"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event._id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
          {event.images && event.images[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-blue-300" />
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 backdrop-blur-sm text-blue-600 font-bold">
              {event.price === 0 ? "FREE" : `฿${event.price}`}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 flex-shrink-0" />
              <span className="capitalize">{event.type}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <Badge variant="secondary">{event.type}</Badge>
            <span className="text-xs text-gray-500">
              {event.views || 0} views
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}