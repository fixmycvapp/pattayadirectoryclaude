"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink, Loader2 } from "lucide-react";
import { EventDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface EventVenueProps {
  event: EventDetail;
}

export default function EventVenue({ event }: EventVenueProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const latitude = event.latitude || 12.9280; // Default Pattaya coords
  const longitude = event.longitude || 100.8778;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapEmbedUrl = apiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`
    : null;

  useEffect(() => {
    // Set a timeout to show error if map doesn't load
    const timeout = setTimeout(() => {
      if (!mapLoaded) {
        setMapError(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [mapLoaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-orange-600" />
        </div>
        Event Location
      </h2>

      {/* Google Maps Embed */}
      <div className="mb-6">
        <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-md">
          {mapEmbedUrl ? (
            <>
              {!mapLoaded && !mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-3" />
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              
              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">Unable to load map</p>
                    <Button
                      onClick={() => window.open(googleMapsUrl, '_blank')}
                      variant="outline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              )}

              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location Map"
                onLoad={() => setMapLoaded(true)}
                onError={() => setMapError(true)}
                className={mapLoaded ? 'opacity-100' : 'opacity-0'}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <p className="text-gray-700 font-medium mb-2">📍 {event.location}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Google Maps API key not configured
                </p>
                <Button
                  onClick={() => window.open(googleMapsUrl, '_blank')}
                  variant="outline"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Google Maps
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-lg">{event.location}</p>
            {event.address && (
              <p className="text-gray-600 mt-1">{event.address}</p>
            )}
            <p className="text-gray-600 mt-1">Pattaya, Chonburi, Thailand</p>
            {event.latitude && event.longitude && (
              <p className="text-sm text-gray-500 mt-2">
                Coordinates: {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Google Maps
          </Button>
          <Button
            onClick={() => window.open(directionsUrl, '_blank', 'noopener,noreferrer')}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Getting There Info */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="font-semibold text-gray-900 mb-4">Getting There</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Accessible by taxi or Grab
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Local songthaew (baht bus) nearby
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Parking available at venue
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            10-15 minutes from central Pattaya
          </li>
        </ul>
      </div>
    </motion.div>
  );
}