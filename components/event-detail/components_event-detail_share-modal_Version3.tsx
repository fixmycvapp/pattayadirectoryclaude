"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Facebook, Twitter, Linkedin, Link as LinkIcon, Mail, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  eventTitle: string;
  eventUrl: string;
  onClose: () => void;
}

export default function ShareModal({ eventTitle, eventUrl, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventTitle)}&url=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-700 hover:bg-gray-800",
      url: `mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(`Check out this event: ${eventUrl}`)}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Share Event</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => handleShare(link.url)}
                  className={`${link.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* Copy Link */}
          <div className="border-t pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or copy link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600"
              />
              <Button
                onClick={handleCopyLink}
                className="px-6"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}