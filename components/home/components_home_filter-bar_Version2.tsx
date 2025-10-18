"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Calendar as CalendarIcon, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EVENT_TYPES, LOCATIONS } from "@/lib/constants";

export default function FilterBar() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    location: "",
    date: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.location) params.append("location", filters.location);
    if (filters.date) params.append("date", filters.date);

    router.push(`/events?${params.toString()}`);
  };

  return (
    <section className="py-12 bg-white relative -mt-16 z-20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Events
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Concerts, festivals, nightlife..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 h-12 text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Event Type
              </label>
              <Select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="h-12 text-base"
              >
                <option value="">All Types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <Select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="h-12 text-base"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSearch}
              size="lg"
              className="px-12 h-12 text-base bg-gradient-tropical hover:shadow-xl transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Events
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}