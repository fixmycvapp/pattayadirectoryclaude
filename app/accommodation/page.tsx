"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import AccommodationCard from "@/components/AccommodationCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceCategory: '',
    search: '',
  });

  useEffect(() => {
    fetchAccommodations();
  }, [filters]);

  const accommodation = await Accommodation.findById(id);
const nearbyEvents = await Event.find({
  latitude: { $gte: accommodation.location.latitude - 0.05, $lte: accommodation.location.latitude + 0.05 },
  longitude: { $gte: accommodation.location.longitude - 0.05, $lte: accommodation.location.longitude + 0.05 },
});

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        ...(filters.location && { location: filters.location }),
        ...(filters.type && { type: filters.type }),
        ...(filters.priceCategory && { priceCategory: filters.priceCategory }),
      });

      const response = await fetch(`${apiUrl}/accommodation?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAccommodations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      priceCategory: '',
      search: '',
    });
  };

  const hasActiveFilters = filters.location || filters.type || filters.priceCategory;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-teal-600 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Accommodation in Pattaya
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find your perfect stay near the best events and attractions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-0 z-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Location */}
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="beach-road">Beach Road</option>
              <option value="jomtien">Jomtien</option>
              <option value="naklua">Naklua</option>
              <option value="pratumnak">Pratumnak</option>
              <option value="central-pattaya">Central Pattaya</option>
              <option value="walking-street">Walking Street</option>
            </select>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
              <option value="condo">Condo</option>
              <option value="hostel">Hostel</option>
              <option value="guesthouse">Guesthouse</option>
            </select>

            {/* Price Category */}
            <select
              value={filters.priceCategory}
              onChange={(e) => setFilters({ ...filters, priceCategory: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-Range</option>
              <option value="luxury">Luxury</option>
              <option value="ultra-luxury">Ultra Luxury</option>
            </select>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Results Info */}
          {!loading && accommodations.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{accommodations.length}</span> accommodations
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
          )}

          {/* Empty State */}
          {!loading && accommodations.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No accommodations found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}

          {/* Grid */}
          {!loading && accommodations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accommodations.map((accommodation, index) => (
                <motion.div
                  key={accommodation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccommodationCard accommodation={accommodation} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}