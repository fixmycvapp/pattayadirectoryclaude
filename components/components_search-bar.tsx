"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        router.push(`/events?search=${encodeURIComponent(query)}`);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for concerts, festivals, nightlife..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white/20 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 focus:border-white transition-all text-lg"
        />
      </div>
    </motion.div>
  );
}