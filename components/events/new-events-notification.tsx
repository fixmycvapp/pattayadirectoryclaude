"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface NewEventsNotificationProps {
  isVisible: boolean;
  onRefresh: () => void;
  onDismiss: () => void;
  autoHideDelay?: number; // milliseconds (default: 10000 = 10s)
}

export default function NewEventsNotification({
  isVisible,
  onRefresh,
  onDismiss,
  autoHideDelay = 10000,
}: NewEventsNotificationProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);

      // Auto-hide after delay
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(() => {
          onDismiss();
        }, 300); // Wait for exit animation
      }, autoHideDelay);

      return () => clearTimeout(timer);
    } else {
      setIsShowing(false);
    }
  }, [isVisible, autoHideDelay, onDismiss]);

  const handleRefresh = () => {
    setIsShowing(false);
    setTimeout(() => {
      onRefresh();
    }, 300);
  };

  const handleDismiss = () => {
    setIsShowing(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500, // ⬅️ Higher = faster
            damping: 40,   // ⬅️ Lower = more bounce
            mass: 1,
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          // Options:
          className="fixed top-4 right-4 z-[100]"           // Top right
          className="fixed bottom-4 right-4 z-[100]"        // Bottom right
          className="fixed top-20 left-1/2 -translate-x-1/2" // Below header
        >
          <div className="relative">
            {/* Main notification card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white rounded-2xl shadow-2xl border border-blue-400/20 backdrop-blur-xl overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-teal-400/20 animate-pulse" />

              {/* Content */}
              <div className="relative p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                  >
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">
                      New Events Available! 🎉
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Fresh events have been added. Click refresh to see the latest happenings in Pattaya.
                    </p>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-4 ml-16">
                  <Button
                    onClick={handleRefresh}
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Now
                  </Button>

                  <button
                    onClick={handleDismiss}
                    className="text-sm text-blue-100 hover:text-white font-medium transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: autoHideDelay / 1000,
                  ease: "linear",
                }}
                className="h-1 bg-white/30"
              />
            </motion.div>

            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-blue-500/20 blur-2xl rounded-2xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}