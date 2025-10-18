"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Calendar, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Venue {
  _id?: string;
  id?: string;
  name: string;
  type: string;
  address: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  rating?: number;
  website?: string;
  description?: string;
}

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const venueId = venue._id || venue.id;
  const googleMapsUrl = venue.latitude && venue.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address + ", Pattaya, Thailand")}`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-teal-100">
        {venue.imageUrl ? (
          <Image
            src={venue.imageUrl}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-blue-300" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 capitalize">
            {venue.type}
          </Badge>
        </div>

        {/* Rating */}
        {venue.rating && (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-400 text-white px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              {venue.rating.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
          {venue.name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{venue.address}</span>
        </div>

        {/* Description */}
        {venue.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {venue.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href={`/events?venue=${venueId}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View Events
            </Button>
          </Link>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full bg-gradient-tropical">
              <MapPin className="w-4 h-4 mr-2" />
              Map
            </Button>
          </a>
        </div>

        {/* Website Link */}
        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ExternalLink className="w-3 h-3" />
            Visit Website
          </a>
        )}
      </div>
    </motion.div>
  );
}