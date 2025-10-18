"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, Facebook, Instagram, Music2 } from "lucide-react";
import { EventDetail } from "@/lib/types";

interface EventContactProps {
  event: EventDetail;
}

export default function EventContact({ event }: EventContactProps) {
  const hasContactInfo = event.contactEmail || event.contactPhone || event.website;
  const hasSocials = event.socialLinks?.facebook || event.socialLinks?.instagram || event.socialLinks?.tiktok;

  if (!hasContactInfo && !hasSocials) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl border border-blue-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact & Social</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        {hasContactInfo && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
            
            {event.contactEmail && (
              <a
                href={`mailto:${event.contactEmail}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-900 font-semibold">{event.contactEmail}</p>
                </div>
              </a>
            )}

            {event.contactPhone && (
              <a
                href={`tel:${event.contactPhone}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-900 font-semibold">{event.contactPhone}</p>
                </div>
              </a>
            )}

            {event.website && (
              <a
                href={event.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Website</p>
                  <p className="text-gray-900 font-semibold truncate max-w-[200px]">
                    {event.website.replace(/(^\w+:|^)\/\//, '')}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}

        {/* Social Media */}
        {hasSocials && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>

            {event.socialLinks?.facebook && (
              <a
                href={event.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Facebook</p>
                  <p className="text-gray-900 font-semibold">Follow on Facebook</p>
                </div>
              </a>
            )}

            {event.socialLinks?.instagram && (
              <a
                href={event.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Instagram</p>
                  <p className="text-gray-900 font-semibold">Follow on Instagram</p>
                </div>
              </a>
            )}

            {event.socialLinks?.tiktok && (
              <a
                href={event.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">TikTok</p>
                  <p className="text-gray-900 font-semibold">Follow on TikTok</p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}