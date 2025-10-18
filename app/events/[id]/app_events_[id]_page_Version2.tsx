"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/lib/api";
import { Event } from "@/lib/types";
import EventGallery from "@/components/event-gallery";
import MapEmbed from "@/components/map-embed";
import { Calendar, MapPin, Ticket, Clock, Users, Loader2, Share2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const data = await getEvent(params.id as string);
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${format(new Date(event.date), 'yyyyMMdd')}/${format(new Date(event.date), 'yyyyMMdd')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(calendarUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-custom py-12">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <a href="/events" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to all events
        </a>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="container-custom">
        {/* Gallery */}
        <EventGallery images={event.images} title={event.title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl font-bold flex-1">{event.title}</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{event.type}</Badge>
              {event.priceCategory && (
                <Badge variant="outline">{event.priceCategory}</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{format(new Date(event.date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <MapEmbed location={event.location} />
              <p className="mt-4 text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </p>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {event.price === 0 ? "FREE" : `฿${event.price.toLocaleString()}`}
                </div>
                {event.priceCategory && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {event.priceCategory}
                  </span>
                )}
              </div>

              <button className="w-full btn-primary mb-3">
                <Ticket className="w-5 h-5 inline mr-2" />
                Buy Tickets
              </button>

              <button 
                onClick={handleAddToCalendar}
                className="w-full btn-secondary"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Add to Calendar
              </button>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Views
                  </span>
                  <span className="font-semibold">{event.views || 0}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Category:</span> {event.type}
                </div>
                {event.organizer && (
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Organizer:</span> {event.organizer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}