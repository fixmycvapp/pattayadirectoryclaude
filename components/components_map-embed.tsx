"use client";

interface MapEmbedProps {
  location: string;
}

export default function MapEmbed({ location }: MapEmbedProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Create Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(
    location + ", Pattaya, Thailand"
  )}`;

  // Fallback if no API key
  if (!googleMapsApiKey) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map API key not configured</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}