"use client";

import { Calendar, Ticket, Users, Tag } from "lucide-react";
import { EventDetail } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EventBookingCardProps {
  event: EventDetail;
}

export default function EventBookingCard({ event }: EventBookingCardProps) {
  const handleBooking = () => {
    if (event.ticketUrl) {
      window.open(event.ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddToCalendar = () => {
    const calendarUrl = createGoogleCalendarUrl(event);
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
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
        {event.ticketUrl ? (
          <button
            onClick={handleBooking}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            {event.price === 0 ? "Register Free" : "Buy Tickets"}
          </button>
        ) : (
          <button
            disabled
            className="w-full h-14 bg-gray-300 text-gray-600 rounded-xl font-semibold text-lg cursor-not-allowed"
          >
            Tickets Coming Soon
          </button>
        )}

        <button
          onClick={handleAddToCalendar}
          className="w-full h-14 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Add to Calendar
        </button>
      </div>

      {/* Event Stats */}
      <div className="mt-8 pt-8 border-t space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Views
          </span>
          <span className="font-semibold text-gray-900">
            {event.views?.toLocaleString() || 0}
          </span>
        </div>
        {event.capacity && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity
            </span>
            <span className="font-semibold text-gray-900">
              {event.capacity.toLocaleString()}
            </span>
          </div>
        )}
        {event.attendees !== undefined && event.capacity && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Registered
            </span>
            <span className="font-semibold text-gray-900">
              {event.attendees.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Category
          </span>
          <Badge variant="secondary" className="capitalize">
            {event.type}
          </Badge>
        </div>
      </div>

      {/* Age Restriction */}
      {event.ageRestriction && event.ageRestriction !== 'all-ages' && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <span className="font-semibold">⚠️ Age Restriction:</span>
            <span className="uppercase">{event.ageRestriction}</span>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="mt-8 pt-8 border-t">
        <p className="text-xs text-gray-500 leading-relaxed">
          ✓ Secure booking process<br />
          ✓ Verified event organizer<br />
          ✓ Customer support available<br />
          ✓ Refund policy applicable
        </p>
      </div>
    </div>
  );
}

// Helper function to create Google Calendar URL
function createGoogleCalendarUrl(event: EventDetail): string {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.description,
    location: event.address || `${event.location}, Pattaya, Thailand`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}