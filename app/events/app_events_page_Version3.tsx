"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import EventCard from "@/components/event-card";
import EventFilters from "@/components/events/event-filters";
import EventsHeader from "@/components/events/events-header";
import EventsSkeleton from "@/components/events/events-skeleton";
import Pagination from "@/components/events/pagination";
import { getEvents } from "@/lib/api";
import { Event, FilterParams } from "@/lib/types";
import { Loader2, AlertCircle } from "lucide-react";

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterParams>({
    type: searchParams.get("type") || "",
    location: searchParams.get("location") || "",
    priceCategory: searchParams.get("priceCategory") || "",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "date",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
  });

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents();
    updateURL();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getEvents(filters);
      
      // Handle both array response and object response with data property
      if (Array.isArray(response)) {
        setEvents(response);
        setTotalEvents(response.length);
        setTotalPages(1);
      } else {
        setEvents(response.data || []);
        setTotalEvents(response.total || 0);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events. Please try again later.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && key !== "limit") {
        params.set(key, value.toString());
      }
    });

    router.push(`/events?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setFilters({
      type: "",
      location: "",
      priceCategory: "",
      search: "",
      sort: "date",
      page: 1,
      limit: 12,
    });
  };

  const hasActiveFilters = Boolean(
    filters.type || 
    filters.location || 
    filters.priceCategory || 
    filters.search
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <EventsHeader 
        totalEvents={totalEvents}
        currentSort={filters.sort || "date"}
        onSortChange={handleSortChange}
      />

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 flex-shrink-0">
            <EventFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-600">
                {loading ? (
                  <span>Loading events...</span>
                ) : (
                  <span>
                    Showing <span className="font-semibold text-gray-900">{events.length}</span> of{" "}
                    <span className="font-semibold text-gray-900">{totalEvents}</span> events
                    {filters.page && filters.page > 1 && (
                      <span> (Page {filters.page} of {totalPages})</span>
                    )}
                  </span>
                )}
              </div>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </motion.button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <EventsSkeleton count={12} />
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-900 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchEvents}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && events.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-tropical text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Events Grid */}
            {!loading && !error && events.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={filters.page || 1}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsSkeleton count={12} />}>
      <EventsContent />
    </Suspense>
  );
}