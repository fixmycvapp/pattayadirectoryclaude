"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Clock, Utensils, Wine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Venue {
  _id: string;
  name: string;
  category: string;
  cuisine?: string[];
  location: {
    area: string;
  };
  priceRange: string;
  rating: {
    average: number;
    count: number;
  };
  images: {
    main: string;
  };
  description: {
    short: string;
  };
  features: string[];
  slug: string;
}

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant':
      case 'cafe':
        return <Utensils className="w-4 h-4" />;
      case 'bar':
      case 'club':
      case 'rooftop-bar':
        return <Wine className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  const getPriceIndicator = (priceRange: string) => {
    switch (priceRange) {
      case 'budget':
        return '฿';
      case 'moderate':
        return '฿฿';
      case 'expensive':
        return '฿฿฿';
      case 'fine-dining':
        return '฿฿฿฿';
      default:
        return '฿';
    }
  };

  return (
    <Link href={`/nightlife/${venue.slug || venue._id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100">
            <Image
              src={venue.images.main}
              alt={venue.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-gray-900 capitalize flex items-center gap-1">
                {getCategoryIcon(venue.category)}
                {venue.category.replace('-', ' ')}
              </Badge>
            </div>

            {/* Price Range */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-100 text-green-800 font-bold">
                {getPriceIndicator(venue.priceRange)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-purple-600 transition-colors">
              {venue.name}
            </h3>

            {/* Cuisine/Type */}
            {venue.cuisine && venue.cuisine.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {venue.cuisine.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded capitalize"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="capitalize">
                {venue.location.area.replace(/-/g, ' ')}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {venue.description.short}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {venue.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md capitalize"
                >
                  {feature.replace('-', ' ')}
                </span>
              ))}
              {venue.features.length > 3 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  +{venue.features.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">
                  {venue.rating.average.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({venue.rating.count})
                </span>
              </div>

              {/* Open hours indicator */}
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Clock className="w-3 h-3" />
                <span>Open</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}