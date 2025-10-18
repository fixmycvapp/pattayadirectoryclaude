"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { Select } from "@/components/ui/select";

interface EventsHeaderProps {
  totalEvents: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export default function EventsHeader({ 
  totalEvents, 
  currentSort, 
  onSortChange 
}: EventsHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {totalEvents.toLocaleString()} Events Available
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Discover Events in Pattaya
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Find concerts, festivals, nightlife, sports, and more happening around the city
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:min-w-[280px]">
              <label className="block text-sm font-semibold mb-2 text-blue-100">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <Select
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="h-12 text-base bg-white/95 backdrop-blur-sm text-gray-900 font-medium"
              >
                <option value="date">📅 Date (Upcoming First)</option>
                <option value="popular">🔥 Most Popular</option>
                <option value="price-low">💰 Price (Low to High)</option>
                <option value="price-high">💎 Price (High to Low)</option>
                <option value="newest">✨ Newest Added</option>
              </Select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}