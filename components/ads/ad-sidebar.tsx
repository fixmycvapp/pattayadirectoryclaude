"use client";

import AdSlot from "./ad-slot";
import { motion } from "framer-motion";

interface AdSidebarProps {
  page?: string;
  category?: string;
}

export default function AdSidebar({ page, category }: AdSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-24 space-y-6"
    >
      {/* Primary Ad Slot */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <AdSlot
          position="sidebar"
          page={page}
          category={category}
          showLabel
        />
      </div>

      {/* Secondary Ad Slot (Optional) */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <AdSlot
          position="sidebar"
          page={page}
          category={category}
          showLabel
        />
      </div>
    </motion.aside>
  );
}