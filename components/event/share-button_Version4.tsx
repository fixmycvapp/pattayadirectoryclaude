"use client";

import { useState } from "react";
import { Share2, Check, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDetail } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  event: EventDetail;
}

export default function ShareButton({ event }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this event: ${event.title}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 2000);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-700',
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
          >
            <div className="space-y-1">
              {shareLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => {
                      window.open(link.url, '_blank', 'width=600,height=400');
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${link.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.name}</span>
                  </button>
                );
              })}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    <span className="font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}