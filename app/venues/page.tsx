"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, MapPin, Search } from "lucide-react";
import VenueCard, { Venue } from "@/components/venue-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/venues`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      const data = await response.json();
      setVenues(data.data || []);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Failed to load venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter venues
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = searchQuery === "" || 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || venue.type === typeFilter;

    return matchesSearch && matchesType;
  });

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-10 h-10" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Popular Venues
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the best clubs, bars, restaurants, and entertainment spots in Pattaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="md:w-64"
            >
              <option value="all">All Types</option>
              <option value="club">Clubs</option>
              <option value="bar">Bars</option>
              <option value="restaurant">Restaurants</option>
              <option value="theater">Theaters</option>
              <option value="hotel">Hotels</option>
              <option value="beach-club">Beach Clubs</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading venues...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Failed to load venues
              </h3>
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredVenues.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-12 text-center max-w-2xl mx-auto"
            >
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No venues found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          )}

          {/* Venues Grid */}
          {!loading && !error && filteredVenues.length > 0 && (
            <>
              <div className="mb-6 text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredVenues.length}</span> venues
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredVenues.map((venue, index) => (
                  <motion.div
                    key={venue._id || venue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <VenueCard venue={venue} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}