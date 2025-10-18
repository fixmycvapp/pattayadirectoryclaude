"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/event-card";
import { getEvents } from "@/lib/api";
import { Event } from "@/lib/types";
import { Loader2, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"featured" | "trending">("featured");

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents({ 
        sort: activeTab === "trending" ? "popular" : "date",
        limit: 6 
      });
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-teal-50 rounded-full mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">
                Hot Events
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured & Trending Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular and upcoming events in Pattaya
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Button
              variant={activeTab === "featured" ? "default" : "outline"}
              onClick={() => setActiveTab("featured")}
              className="px-8"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Featured
            </Button>
            <Button
              variant={activeTab === "trending" ? "default" : "outline"}
              onClick={() => setActiveTab("trending")}
              className="px-8"
            >
              <Flame className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </motion.div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No events available at the moment</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="px-12 h-12 text-base border-2 hover:bg-blue-50"
            onClick={() => window.location.href = "/events"}
          >
            View All Events
          </Button>
        </motion.div>
      </div>
    </section>
  );
}