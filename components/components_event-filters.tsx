"use client";

import { useState } from "react";
import { FilterParams } from "@/lib/types";
import { EVENT_TYPES, LOCATIONS, PRICE_CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface EventFiltersProps {
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
}

export default function EventFilters({ filters, setFilters }: EventFiltersProps) {
  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 sticky top-20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Event Type
          </label>
          <div className="space-y-2">
            {EVENT_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={filters.type === type.value}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Location
          </label>
          <select
            value={filters.location || ""}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price Range
          </label>
          <div className="space-y-2">
            {PRICE_CATEGORIES.map((price) => (
              <label key={price.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  value={price.value}
                  checked={filters.priceCategory === price.value}
                  onChange={(e) => handleFilterChange("priceCategory", e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{price.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort By
          </label>
          <select
            value={filters.sort || ""}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default</option>
            <option value="popular">Most Popular</option>
            <option value="date">Date (Newest)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}