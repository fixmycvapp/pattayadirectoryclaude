"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/event-card";
import EventFilters from "@/components/event-filters";
import { getEvents } from "@/lib/api";
import { Event, FilterParams } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({});

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8"
        >
          All Events in Pattaya
        </motion.h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <EventFilters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Events Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No events found matching your criteria</p>
                <button 
                  onClick={() => setFilters({})}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Found {events.length} event{events.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}