"use client";

import { useState, useCallback } from "react";

export type EventCategory = 
  | "all"
  | "nightlife"
  | "live-music"
  | "food-festivals"
  | "sports"
  | "family-events"
  | "markets"
  | "beach-parties"
  | "cultural";

export interface Category {
  id: EventCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "All Events", icon: "✨", color: "from-blue-500 to-teal-500" },
  { id: "nightlife", label: "Nightlife", icon: "🌙", color: "from-purple-500 to-pink-500" },
  { id: "live-music", label: "Live Music", icon: "🎵", color: "from-blue-500 to-cyan-500" },
  { id: "food-festivals", label: "Food Festivals", icon: "🍜", color: "from-orange-500 to-red-500" },
  { id: "sports", label: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },
  { id: "family-events", label: "Family Events", icon: "👨‍👩‍👧‍👦", color: "from-yellow-500 to-amber-500" },
  { id: "markets", label: "Markets", icon: "🛍️", color: "from-teal-500 to-green-500" },
  { id: "beach-parties", label: "Beach Parties", icon: "🏖️", color: "from-cyan-500 to-blue-500" },
  { id: "cultural", label: "Cultural", icon: "🏮", color: "from-red-500 to-orange-500" },
];

export function useCategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");

  const selectCategory = useCallback((category: EventCategory) => {
    setSelectedCategory(category);
  }, []);

  const clearCategory = useCallback(() => {
    setSelectedCategory("all");
  }, []);

  return {
    selectedCategory,
    selectCategory,
    clearCategory,
    categories: CATEGORIES,
  };
}