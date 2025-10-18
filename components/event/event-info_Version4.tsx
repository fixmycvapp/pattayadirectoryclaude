"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Building2, FileText } from "lucide-react";
import { format } from "date-fns";
import { EventDetail } from "@/lib/types";

interface EventInfoProps {
  event: EventDetail;
}

export default function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="space-y-8">
      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={Calendar}
          label="Date"
          value={format(new Date(event.date), "EEEE, MMMM d, yyyy")}
          colorClass="bg-blue-100 text-blue-600"
        />
        <InfoCard
          icon={Clock}
          label="Time"
          value={event.time}
          colorClass="bg-teal-100 text-teal-600"
        />
        <InfoCard
          icon={MapPin}
          label="Location"
          value={event.location}
          subtitle="Pattaya, Thailand"
          colorClass="bg-orange-100 text-orange-600"
        />
        {event.organizer && (
          <InfoCard
            icon={Building2}
            label="Organizer"
            value={event.organizer}
            colorClass="bg-purple-100 text-purple-600"
          />
        )}
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          About This Event
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {event.description}
          </p>
        </div>

        {/* Event Highlights */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">Event Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Info Card Component
function InfoCard({
  icon: Icon,
  label,
  value,
  subtitle,
  colorClass,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  colorClass: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}