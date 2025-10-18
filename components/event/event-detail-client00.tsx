"use client";

import { motion } from "framer-motion";
import EventHero from "./event-hero";
import EventInfo from "./event-info";
import EventMedia from "./event-media";
import EventVenue from "./event-venue";
import EventContact from "./event-contact";
import RelatedEvents from "./related-events";
import BackButton from "./back-button";
import ShareButton from "./share-button";
import { EventDetail } from "@/lib/types";

interface EventDetailClientProps {
  event: EventDetail;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Action Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <BackButton />
            <ShareButton event={event} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <EventHero event={event} />

      {/* Main Content */}
      <div className="container-custom py-12 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Event Info */}
            <EventInfo event={event} />

            {/* Media Section */}
            {(event.images?.length > 0 || event.videoUrl) && (
              <EventMedia event={event} />
            )}

            {/* Venue Section */}
            <EventVenue event={event} />

            {/* Contact Section */}
            <EventContact event={event} />
          </motion.div>

          {/* Right Column - Sticky Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32">
              <EventBookingCard event={event} />
            </div>
          </motion.div>
        </div>

        {/* Related Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <RelatedEvents eventId={event._id || event.id} eventType={event.type} />
        </motion.div>
      </div>
    </div>
  );
}

// Booking Card Component
function EventBookingCard({ event }: { event: EventDetail }) {
  const handleBooking = () => {
    if (event.ticketUrl) {
      window.open(event.ticketUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Price */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 font-medium mb-2">Event Price</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-blue-600">
            {event.price === 0 ? "FREE" : `฿${event.price.toLocaleString()}`}
          </span>
          {event.price > 0 && (
            <span className="text-gray-500">per person</span>
          )}
        </div>
        {event.priceCategory && (
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {event.priceCategory.charAt(0).toUpperCase() + event.priceCategory.slice(1)}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {event.ticketUrl ? (
          <button
            onClick={handleBooking}
            className="w-full h-14 bg-gradient-tropical text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            {event.price === 0 ? "Register Free" : "Buy Tickets"}
          </button>
        ) : (
          <button
            disabled
            className="w-full h-14 bg-gray-300 text-gray-600 rounded-xl font-semibold text-lg cursor-not-allowed"
          >
            Tickets Coming Soon
          </button>
        )}

        <button
          onClick={() => {
            const calendarUrl = createGoogleCalendarUrl(event);
            window.open(calendarUrl, '_blank');
          }}
          className="w-full h-14 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Add to Calendar
        </button>
      </div>

      {/* Event Stats */}
      <div className="mt-8 pt-8 border-t space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Views
          </span>
          <span className="font-semibold text-gray-900">
            {event.views?.toLocaleString() || 0}
          </span>
        </div>
        {event.capacity && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity
            </span>
            <span className="font-semibold text-gray-900">
              {event.capacity.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Category
          </span>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {event.type}
          </span>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="mt-8 pt-8 border-t">
        <p className="text-xs text-gray-500 leading-relaxed">
          ✓ Secure booking process<br />
          ✓ Verified event organizer<br />
          ✓ Customer support available<br />
          ✓ Refund policy applicable
        </p>
      </div>
    </div>
  );
}

// Helper function
function createGoogleCalendarUrl(event: EventDetail): string {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.description,
    location: `${event.location}, Pattaya, Thailand`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

import { Calendar, Ticket, Users, Tag } from "lucide-react";