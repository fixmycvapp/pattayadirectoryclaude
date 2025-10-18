"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/events?featured=true&limit=5`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching featured events:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container-custom">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Featured Events
            </h2>
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-xl text-gray-600">
            Hand-picked by our editors • Don't miss out!
          </p>
        </motion.div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 5).map((event, index) => (
            <motion.div
              key={event._id || event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeaturedEventCard event={event} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {events.map((event) => (
                <div key={event._id || event.id} className="w-full flex-shrink-0 px-2">
                  <FeaturedEventCard event={event} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          {events.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Featured Event Card Component
function FeaturedEventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event._id || event.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full group"
      >
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-teal-100">
          {event.imageUrl || (event.images && event.images[0]) ? (
            <Image
              src={event.imageUrl || event.images[0]}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-blue-300" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

          {/* Editor's Pick Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Editor's Pick
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold">
              {event.price === 0 ? "FREE" : `฿${event.price}`}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {event.type}
            </Badge>
            {event.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}