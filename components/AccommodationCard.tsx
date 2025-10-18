"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Wifi, Coffee, Car, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Accommodation {
  _id: string;
  name: string;
  type: string;
  location: {
    area: string;
    address: string;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
    priceCategory: string;
  };
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
  amenities: string[];
  slug: string;
}

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'breakfast':
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriceCategoryColor = (category: string) => {
    switch (category) {
      case 'budget':
        return 'bg-green-100 text-green-800';
      case 'mid-range':
        return 'bg-blue-100 text-blue-800';
      case 'luxury':
        return 'bg-purple-100 text-purple-800';
      case 'ultra-luxury':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/accommodation/${accommodation.slug || accommodation._id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-blue-100 to-teal-100">
            <Image
              src={accommodation.images.main}
              alt={accommodation.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Type Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-gray-900 capitalize">
                {accommodation.type}
              </Badge>
            </div>

            {/* Price Category */}
            <div className="absolute top-3 right-3">
              <Badge className={getPriceCategoryColor(accommodation.priceRange.priceCategory)}>
                {accommodation.priceRange.priceCategory.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-1 hover:text-blue-600 transition-colors">
              {accommodation.name}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="line-clamp-1 capitalize">
                {accommodation.location.area.replace(/-/g, ' ')}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {accommodation.description.short}
            </p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {accommodation.amenities.slice(0, 3).map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                >
                  {getAmenityIcon(amenity)}
                  <span className="capitalize">{amenity.replace('-', ' ')}</span>
                </div>
              ))}
              {accommodation.amenities.length > 3 && (
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  +{accommodation.amenities.length - 3} more
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">
                  {accommodation.rating.average.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({accommodation.rating.count})
                </span>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-xs text-gray-500">From</div>
                <div className="font-bold text-blue-600">
                  ฿{accommodation.priceRange.min.toLocaleString()}
                  <span className="text-xs text-gray-500 font-normal">/night</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}