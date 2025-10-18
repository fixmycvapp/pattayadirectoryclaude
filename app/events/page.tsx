"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import EventCard from "@/components/event-card";
import EventFilters from "@/components/events/event-filters";
import EventsHeader from "@/components/events/events-header";
import CategoryMenu from "@/components/category-menu";
import QuickDateFilters, { DateFilter } from "@/components/quick-date-filters";
import NewEventsNotification from "@/components/events/new-events-notification";
import { FilterParams } from "@/lib/types";
import { useInfiniteEvents } from "@/hooks/useInfiniteEvents";
import { useCategoryFilter, EventCategory } from "@/hooks/useCategoryFilter";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import AdBanner from "@/components/ads/ad-banner";
import AdSidebar from "@/components/ads/ad-sidebar";

export default function EventsPage() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const observerTarget = useRef<HTMLDivElement>(null);

  const { selectedCategory, selectCategory, categories } = useCategoryFilter();

  // Combine category and date filters
  const combinedFilters = {
    ...filters,
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(dateFilter !== "all" && { dateRange: dateFilter }),
  };

  const {
    events,
    loading,
    hasMore,
    error,
    newEventsAvailable,
    fetchMore,
    refreshEvents,
    dismissNewEvents,
  } = useInfiniteEvents({
    initialFilters: combinedFilters,
    limit: 12,
    autoRefreshInterval: 60000,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchMore]);

  const handleCategoryChange = useCallback((category: EventCategory) => {
    selectCategory(category);
  }, [selectCategory]);

  const handleDateFilterChange = useCallback((filter: DateFilter) => {
    setDateFilter(filter);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    selectCategory("all");
    setDateFilter("all");
  }, [selectCategory]);

  const hasActiveFilters = Boolean(
    filters.type || 
    filters.location || 
    filters.priceCategory || 
    filters.search ||
    selectedCategory !== "all" ||
    dateFilter !== "all"
  );

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* New Events Notification */}
        <NewEventsNotification
          isVisible={newEventsAvailable}
          onRefresh={refreshEvents}
          onDismiss={dismissNewEvents}
          autoHideDelay={10000}
        />
       {/* Header Ad */}
        <AdBanner position="header" page="events" category={selectedCategory} />

        {/* Category Menu */}
        <CategoryMenu
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Page Header */}
      
        <EventsHeader 
          totalEvents={events.length}
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
              {/* Quick Date Filters */}
              <div className="mb-6">
                <QuickDateFilters
                  selectedFilter={dateFilter}
                  onSelectFilter={handleDateFilterChange}
                />
              </div>

              {/* Results Info */}
              {!loading && events.length > 0 && (
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{events.length}</span> events
                    {hasMore && <span className="text-sm ml-2">(scroll for more)</span>}
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
                  <Button
                    onClick={refreshEvents}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
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
                    We couldn't find any events matching your criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </motion.div>
              )}

              {/* Events Grid */}
              {events.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id || event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Loading Spinner (initial load) */}
              {loading && events.length === 0 && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                </div>
              )}

              {/* Infinite Scroll Loading Indicator */}
              {loading && events.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="flex items-center gap-3 text-blue-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-medium">Loading more events...</span>
                  </div>
                </motion.div>
              )}
              {/* Events Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>

                 {/* Right Sidebar - Ads */}
            <div className="hidden xl:block lg:w-80 flex-shrink-0">
              <AdSidebar page="events" category={selectedCategory} />
            </div>
             {/* Footer Ad */}
        <AdBanner position="footer" page="events" />
            </div>

              {/* End of Results Indicator */}
              {!loading && !hasMore && events.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-block px-6 py-3 bg-gray-100 rounded-full">
                    <p className="text-gray-600 font-medium">
                      🎉 You've reached the end of all events!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Intersection Observer Target */}
              <div ref={observerTarget} className="h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <Toaster />
    </>
  );
}