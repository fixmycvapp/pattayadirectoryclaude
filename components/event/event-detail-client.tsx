"use client";

import { motion } from "framer-motion";
import EventHero from "./event-hero";
import EventInfo from "./event-info";
import EventMedia from "./event-media";
import EventVenue from "./event-venue";
import EventContact from "./event-contact";
import EventBookingCard from "./event-booking-card";
import EventActions from "./event-actions";
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
            <div className="flex items-center gap-2">
              {/* Add Event Actions Here */}
              <div className="hidden md:block">
                <EventActions
                  eventId={event._id || event.id}
                  eventTitle={event.title}
                  eventDate={event.date}
                />
              </div>
              <ShareButton event={event} />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <EventHero event={event} />

      {/* Mobile Action Buttons - Show below hero on mobile */}
      <div className="md:hidden bg-white border-b border-gray-200 py-4">
        <div className="container-custom">
          <EventActions
            eventId={event._id || event.id}
            eventTitle={event.title}
            eventDate={event.date}
          />
        </div>
      </div>

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
            {(event.contactEmail || event.contactPhone || event.website || 
              event.socialLinks?.facebook || event.socialLinks?.instagram || 
              event.socialLinks?.tiktok) && (
              <EventContact event={event} />
            )}
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