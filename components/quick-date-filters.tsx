"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type DateFilter = "all" | "today" | "this-weekend" | "this-week";

interface QuickDateFiltersProps {
  selectedFilter: DateFilter;
  onSelectFilter: (filter: DateFilter) => void;
}

const filters = [
  { id: "all" as DateFilter, label: "All Dates", icon: Calendar },
  { id: "today" as DateFilter, label: "Today", icon: Sparkles },
  { id: "this-weekend" as DateFilter, label: "This Weekend", icon: Calendar },
  { id: "this-week" as DateFilter, label: "This Week", icon: Calendar },
];

export default function QuickDateFilters({
  selectedFilter,
  onSelectFilter,
}: QuickDateFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = selectedFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            onClick={() => onSelectFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2",
              isActive
                ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}