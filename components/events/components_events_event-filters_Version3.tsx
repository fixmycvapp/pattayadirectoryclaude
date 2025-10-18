"use client";

import { motion } from "framer-motion";
import { X, Filter, Calendar, MapPin, Tag, DollarSign } from "lucide-react";
import { FilterParams } from "@/lib/types";
import { EVENT_TYPES, LOCATIONS, PRICE_CATEGORIES } from "@/lib/constants";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventFiltersProps {
  filters: FilterParams;
  onFilterChange: (filters: Partial<FilterParams>) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export default function EventFilters({
  filters,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
}: EventFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Search
          </label>
          <Input
            type="text"
            placeholder="Search events..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full"
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Tag className="w-4 h-4 inline mr-1" />
            Event Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="type"
                value=""
                checked={!filters.type}
                onChange={(e) => onFilterChange({ type: e.target.value })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">All Types</span>
            </label>
            {EVENT_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={filters.type === type.value}
                  onChange={(e) => onFilterChange({ type: e.target.value })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <Select
            value={filters.location || ""}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="w-full"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </Select>
        </div>

        {/* Price Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Price Range
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="priceCategory"
                value=""
                checked={!filters.priceCategory}
                onChange={(e) => onFilterChange({ priceCategory: e.target.value })}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">All Prices</span>
            </label>
            {PRICE_CATEGORIES.map((price) => (
              <label
                key={price.value}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name="priceCategory"
                  value={price.value}
                  checked={filters.priceCategory === price.value}
                  onChange={(e) => onFilterChange({ priceCategory: e.target.value })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{price.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <div className="space-y-2">
            <Input
              type="date"
              placeholder="From"
              className="w-full"
            />
            <Input
              type="date"
              placeholder="To"
              className="w-full"
            />
          </div>
        </div>

        {/* Apply Button */}
        {hasActiveFilters && (
          <Button
            onClick={onClearAll}
            variant="outline"
            className="w-full"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t"
        >
          <p className="text-xs text-gray-500 font-medium mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {EVENT_TYPES.find(t => t.value === filters.type)?.label}
                <button
                  onClick={() => onFilterChange({ type: "" })}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                {filters.location}
                <button
                  onClick={() => onFilterChange({ location: "" })}
                  className="hover:text-teal-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.priceCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {PRICE_CATEGORIES.find(p => p.value === filters.priceCategory)?.label}
                <button
                  onClick={() => onFilterChange({ priceCategory: "" })}
                  className="hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}