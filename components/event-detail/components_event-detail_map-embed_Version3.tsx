"use client";

interface MapEmbedProps {
  location: string;
}

export default function MapEmbed({ location }: MapEmbedProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Create Google Maps embed URL
  const mapUrl = googleMapsApiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(location + ", Pattaya, Thailand")}`
    : null;

  // Fallback if no API key - show static map image
  if (!mapUrl) {
    return (
      <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">📍 {location}</p>
          <p className="text-sm text-gray-500">
            Google Maps integration coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-md border border-gray-200">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${location}`}
      />
    </div>
  );
}