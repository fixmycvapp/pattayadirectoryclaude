"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Users, 
  Share2, 
  Heart,
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertCircle,
  Tag,
  Building2
} from "lucide-react";
import { format } from "date-fns";
import { getEvent, getEvents } from "@/lib/api";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EventGallery from "@/components/event-detail/event-gallery";
import MapEmbed from "@/components/event-detail/map-embed";
import RelatedEvents from "@/components/event-detail/related-events";
import ShareModal from "@/components/event-detail/share-modal";
import EventDetailSkeleton from "@/components/event-detail/event-detail-skeleton";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getEvent(params.id as string);
      
      if (data) {
        setEvent(data);
        // Increment view count (optional - could be done server-side)
        incrementViews(params.id as string);
      } else {
        setError("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (eventId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    
    const startDate = format(new Date(event.date), "yyyyMMdd'T'HHmmss'Z'");
    const endDate = format(new Date(event.date), "yyyyMMdd'T'HHmmss'Z'"); // Same day event
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location + ", Pattaya, Thailand")}`;
    
    window.open(googleCalendarUrl, "_blank");
  };

  const handleBuyTicket = () => {
    // Implement ticket purchase logic
    alert("Redirecting to ticket purchase...");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Save to local storage or backend
  };

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error || "Event Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => router.push("/events")}
                className="px-6"
              >
                Browse All Events
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Image Banner */}
      <div className="relative h-[60vh] min-h-[400px] bg-gray-900">
        <EventGallery images={event.images} title={event.title} />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFavorite}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white">
                  {event.type}
                </Badge>
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                  {event.views?.toLocaleString() || 0} views
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
                {event.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Time</p>
                    <p className="text-lg font-semibold text-gray-900">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                    <p className="text-sm text-gray-500">Pattaya, Thailand</p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Organizer</p>
                      <p className="text-lg font-semibold text-gray-900">{event.organizer}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-blue-600" />
                About This Event
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {event.description}
                </p>
              </div>

              {/* Event Highlights */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Event Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Professional event management
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Premium venue location
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Safe and secure environment
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    Refreshments available
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-600" />
                Event Location
              </h2>
              <MapEmbed location={event.location} />
              <div className="mt-6 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{event.location}</p>
                  <p className="text-gray-600">Pattaya, Chonburi, Thailand</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + ", Pattaya, Thailand")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 mt-2"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
            >
              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 font-medium mb-2">Event Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {event.price === 0 ? "FREE" : `฿${event.price.toLocaleString()}`}
                  </span>
                  {event.price > 0 && (
                    <span className="text-gray-500">per person</span>
                  )}
                </div>
                {event.priceCategory && (
                  <Badge variant="secondary" className="mt-2">
                    {event.priceCategory.charAt(0).toUpperCase() + event.priceCategory.slice(1)}
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyTicket}
                  size="lg"
                  className="w-full h-14 text-base font-semibold bg-gradient-tropical hover:shadow-xl transition-all"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {event.price === 0 ? "Register for Free" : "Buy Tickets"}
                </Button>

                <Button
                  onClick={handleAddToCalendar}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-base font-semibold border-2"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Add to Calendar
                </Button>
              </div>

              {/* Event Stats */}
              <div className="mt-8 pt-8 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Views
                  </span>
                  <span className="font-semibold text-gray-900">
                    {event.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </span>
                  <Badge variant="secondary">
                    {event.type}
                  </Badge>
                </div>
              </div>

              {/* Social Share */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-3">Share this event</p>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(true)}
                  className="w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </div>

              {/* Safety Info */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-xs text-gray-500 leading-relaxed">
                  ✓ Secure ticket purchase<br />
                  ✓ Verified event organizer<br />
                  ✓ Customer support available
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <RelatedEvents currentEventId={event._id} eventType={event.type} />
        </motion.div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          eventTitle={event.title}
          eventUrl={typeof window !== "undefined" ? window.location.href : ""}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}