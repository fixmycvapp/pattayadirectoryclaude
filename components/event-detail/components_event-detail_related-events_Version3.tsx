"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import EventCard from "@/components/event-card";
import { getEvents } from "@/lib/api";
import { Event } from "@/lib/types";
import EventsSkeleton from "@/components/events/events-skeleton";

interface RelatedEventsProps {
  currentEventId: string;
  eventType: string;
}

export default function RelatedEvents({ currentEventId, eventType }: RelatedEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedEvents();
  }, [currentEventId, eventType]);

  const fetchRelatedEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents({ 
        type: eventType,
        limit: 3
      });
      
      const eventsData = Array.isArray(response) ? response : response.data || [];
      
      // Filter out current event
      const filtered = eventsData.filter((e: Event) => e._id !== currentEventId);
      setEvents(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching related events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Events</h2>
        <EventsSkeleton count={3} />
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-900">
            You Might Also Like
          </h2>
        </div>
        <p className="text-gray-600">
          More events similar to this one
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}