interface LocationCoordinates {
  latitude: number;
  longitude: number;
  area?: string;
}

interface NearbyData {
  accommodations: any[];
  venues: any[];
  events: any[];
  news: any[];
  transport: any;
  weather?: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all nearby data for a given location
 */
export async function getNearbyData(
  location: string,
  coordinates?: LocationCoordinates
): Promise<NearbyData> {
  try {
    const [
      accommodationsRes,
      venuesRes,
      eventsRes,
      newsRes,
    ] = await Promise.all([
      fetch(`${API_URL}/accommodation?location=${location}&limit=6`, { cache: 'no-store' }),
      fetch(`${API_URL}/venues?location=${location}&limit=6`, { cache: 'no-store' }),
      fetch(`${API_URL}/events?location=${location}&upcoming=true&limit=6`, { cache: 'no-store' }),
      fetch(`${API_URL}/news?limit=5`, { cache: 'no-store' }),
    ]);

    const [accommodations, venues, events, news] = await Promise.all([
      accommodationsRes.ok ? accommodationsRes.json() : { data: [] },
      venuesRes.ok ? venuesRes.json() : { data: [] },
      eventsRes.ok ? eventsRes.json() : { data: [] },
      newsRes.ok ? newsRes.json() : { data: [] },
    ]);

    // Get weather data if coordinates provided
    let weather = null;
    if (coordinates && process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
        );
        if (weatherRes.ok) {
          weather = await weatherRes.json();
        }
      } catch (error) {
        console.error('Weather fetch failed:', error);
      }
    }

    return {
      accommodations: accommodations.data || [],
      venues: venues.data || [],
      events: events.data || [],
      news: news.data || [],
      transport: getTransportInfo(location),
      weather,
    };
  } catch (error) {
    console.error('Error fetching nearby data:', error);
    
    // Return mock data for development
    return getMockData(location);
  }
}

/**
 * Get transport information for a location
 */
function getTransportInfo(location: string) {
  const transportData: Record<string, any> = {
    'walking-street': {
      bahtBus: 'Main route along Beach Road (10 THB)',
      motorbikeTaxi: 'Available 24/7 (50-100 THB)',
      parking: 'Limited street parking, use nearby malls',
      tips: ['Busy at night', 'Walking is best option', 'Taxis charge premium'],
    },
    'jomtien': {
      bahtBus: 'From Central Pattaya (20 THB)',
      motorbikeTaxi: 'Beach stands available (60-120 THB)',
      parking: 'Beach Road parking (20 THB/hour)',
      tips: ['Quieter than central', 'Good beach access', 'Family-friendly'],
    },
    'central-pattaya': {
      bahtBus: 'Hub for all routes (10 THB)',
      motorbikeTaxi: 'Multiple stands (40-80 THB)',
      parking: 'Central Festival free with purchase',
      tips: ['Best connectivity', 'Shopping nearby', 'Easy access everywhere'],
    },
    'naklua': {
      bahtBus: 'North Pattaya route (10 THB)',
      motorbikeTaxi: 'Available near main road (50-100 THB)',
      parking: 'Street parking available',
      tips: ['Local vibe', 'Seafood restaurants', 'Less touristy'],
    },
  };

  return transportData[location] || transportData['central-pattaya'];
}

/**
 * Get current location coordinates
 */
export function getCurrentLocation(): Promise<LocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Default to Central Pattaya
        resolve({
          latitude: 12.9236,
          longitude: 100.8825,
          area: 'central-pattaya',
        });
      },
      {
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

/**
 * Determine area from coordinates
 */
export function getAreaFromCoordinates(lat: number, lng: number): string {
  // Simple proximity check to major areas
  const areas = [
    { name: 'walking-street', lat: 12.9275, lng: 100.8775, radius: 0.01 },
    { name: 'jomtien', lat: 12.8875, lng: 100.8850, radius: 0.02 },
    { name: 'naklua', lat: 12.9650, lng: 100.8750, radius: 0.02 },
    { name: 'pratumnak', lat: 12.9100, lng: 100.8800, radius: 0.015 },
    { name: 'central-pattaya', lat: 12.9236, lng: 100.8825, radius: 0.02 },
  ];

  for (const area of areas) {
    const distance = Math.sqrt(
      Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
    );
    if (distance < area.radius) {
      return area.name;
    }
  }

  return 'central-pattaya'; // Default
}

/**
 * Get smart suggestions based on time of day
 */
export function getSmartSuggestions(): {
  type: string;
  title: string;
  description: string;
  categories: string[];
} {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) {
    return {
      type: 'breakfast',
      title: 'Good Morning! ☀️',
      description: 'Start your day with breakfast spots and cafes',
      categories: ['cafe', 'restaurant'],
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      type: 'lunch',
      title: 'Lunch Time! 🍽️',
      description: 'Explore local restaurants and street food',
      categories: ['restaurant', 'street-food'],
    };
  } else if (hour >= 15 && hour < 19) {
    return {
      type: 'afternoon',
      title: 'Afternoon Relaxation ☕',
      description: 'Perfect time for beach bars and rooftop lounges',
      categories: ['bar', 'beach-club', 'cafe'],
    };
  } else {
    return {
      type: 'nightlife',
      title: 'Night Time! 🌙',
      description: 'Experience Pattaya nightlife - clubs, bars, and live music',
      categories: ['club', 'bar', 'rooftop-bar'],
    };
  }
}

/**
 * Mock data for development
 */
function getMockData(location: string): NearbyData {
  return {
    accommodations: [
      {
        _id: '1',
        name: 'Hilton Pattaya',
        type: 'hotel',
        location: { area: location, address: 'Beach Road' },
        priceRange: { min: 3500, max: 8000, currency: 'THB', priceCategory: 'luxury' },
        rating: { average: 4.6, count: 1250 },
        images: { main: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
        description: { short: 'Luxury beachfront hotel with stunning views' },
        amenities: ['wifi', 'pool', 'gym', 'spa'],
        slug: 'hilton-pattaya',
      },
    ],
    venues: [
      {
        _id: '1',
        name: 'The Sky Gallery',
        category: 'rooftop-bar',
        cuisine: ['international'],
        location: { area: location },
        priceRange: 'expensive',
        rating: { average: 4.7, count: 890 },
        images: { main: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b' },
        description: { short: 'Stunning rooftop bar with panoramic views' },
        features: ['rooftop', 'live-music'],
        slug: 'sky-gallery',
      },
    ],
    events: [
      {
        _id: '1',
        title: 'Pattaya Music Festival',
        date: new Date(Date.now() + 86400000 * 7).toISOString(),
        location: 'Beach Road',
        type: 'concert',
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
      },
    ],
    news: [
      {
        _id: '1',
        title: 'Pattaya Tourism Booming in 2025',
        summary: 'Record number of visitors expected this season',
        category: 'tourism',
        imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
        author: { name: 'Pattaya Directory' },
        publishedAt: new Date().toISOString(),
        priority: 'normal',
        views: 1234,
        slug: 'tourism-boom-2025',
      },
    ],
    transport: getTransportInfo(location),
    weather: null,
  };
}