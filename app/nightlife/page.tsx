"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Utensils, Wine, Coffee } from "lucide-react";
import VenueCard from "@/components/VenueCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NightlifePage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    fetchVenues();
  }, [category, location, priceRange]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams({
        ...(category !== 'all' && { category }),
        ...(location && { location }),
        ...(priceRange && { priceRange }),
      });

      const response = await fetch(`${apiUrl}/venues?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setVenues(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setLocation('');
    setPriceRange('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Food & Nightlife
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Explore the best restaurants, bars, and clubs in Pattaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-0 z-10">
        <div className="container-custom">
          <Tabs value={category} onValueChange={setCategory} className="mb-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="restaurant">
                <Utensils className="w-4 h-4 mr-2" />
                Restaurants
              </TabsTrigger>
              <TabsTrigger value="bar">
                <Wine className="w-4 h-4 mr-2" />
                Bars & Clubs
              </TabsTrigger>
              <TabsTrigger value="cafe">
                <Coffee className="w-4 h-4 mr-2" />
                Cafes
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Areas</option>
              <option value="beach-road">Beach Road</option>
              <option value="walking-street">Walking Street</option>
              <option value="jomtien">Jomtien</option>
              <option value="central-pattaya">Central Pattaya</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Prices</option>
              <option value="budget">Budget (฿)</option>
              <option value="moderate">Moderate (฿฿)</option>
              <option value="expensive">Expensive (฿฿฿)</option>
              <option value="fine-dining">Fine Dining (฿฿฿฿)</option>
            </select>

            {(location || priceRange) && (
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
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
          )}

          {!loading && venues.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No venues found
              </h3>
              <p className="text-gray-600">Try different filters</p>
            </div>
          )}

          {!loading && venues.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {venues.map((venue, index) => (
                <motion.div
                  key={venue._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VenueCard venue={venue} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}