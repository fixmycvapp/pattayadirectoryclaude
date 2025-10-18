"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category, EventCategory } from "@/hooks/useCategoryFilter";
import { cn } from "@/lib/utils";

interface CategoryMenuProps {
  categories: Category[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

export default function CategoryMenu({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative bg-white border-b border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="relative py-4">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Categories Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-12 md:px-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    "relative flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active gradient background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className={cn(
                        "absolute inset-0 rounded-full bg-gradient-to-r",
                        category.color
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="categoryUnderline"
                      className={cn(
                        "absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r",
                        category.color
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors hidden md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}