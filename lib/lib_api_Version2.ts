import { Event, FilterParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface EventsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Event[];
}

export async function getEvents(filters?: FilterParams): Promise<EventsResponse | Event[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_URL}/events?${queryParams.toString()}`;
    console.log("Fetching events from:", url);
    
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the full response object if it has pagination info
    if (data.total !== undefined && data.pages !== undefined) {
      return data;
    }
    
    // Otherwise return just the array
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    
    // Return mock data for development
    return getMockEvents(filters);
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

// Mock data for development/testing
function getMockEvents(filters?: FilterParams): Event[] {
  const mockEvents: Event[] = [
    {
      _id: "1",
      title: "Beach Music Festival 2025",
      description: "Join us for the biggest beach music festival in Pattaya! Featuring international DJs and local artists.",
      date: "2025-11-15T18:00:00Z",
      time: "18:00",
      location: "Beach Road",
      type: "concert",
      price: 1500,
      priceCategory: "moderate",
      images: ["https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800"],
      organizer: "Pattaya Events Co.",
      views: 1250,
      createdAt: "2025-10-01T00:00:00Z",
      updatedAt: "2025-10-16T08:47:05Z",
    },
    {
      _id: "2",
      title: "Night Market Extravaganza",
      description: "Experience authentic Thai street food and shopping at our weekly night market.",
      date: "2025-10-25T17:00:00Z",
      time: "17:00",
      location: "Walking Street",
      type: "market",
      price: 0,
      priceCategory: "free",
      images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"],
      views: 890,
      createdAt: "2025-09-15T00:00:00Z",
      updatedAt: "2025-10-16T08:47:05Z",
    },
    {
      _id: "3",
      title: "Songkran Water Festival",
      description: "Celebrate Thai New Year with the biggest water fight in Pattaya!",
      date: "2026-04-13T10:00:00Z",
      time: "10:00",
      location: "Central Pattaya",
      type: "festival",
      price: 0,
      priceCategory: "free",
      images: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800"],
      views: 2100,
      createdAt: "2025-10-01T00:00:00Z",
      updatedAt: "2025-10-16T08:47:05Z",
    },
    {
      _id: "4",
      title: "Muay Thai Championship",
      description: "Watch Thailand's best fighters compete in this exciting championship event.",
      date: "2025-11-20T19:00:00Z",
      time: "19:00",
      location: "Jomtien Beach",
      type: "sports",
      price: 800,
      priceCategory: "budget",
      images: ["https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=800"],
      views: 675,
      createdAt: "2025-10-05T00:00:00Z",
      updatedAt: "2025-10-16T08:47:05Z",
    },
  ];

  // Filter mock data
  let filteredEvents = [...mockEvents];

  if (filters?.type) {
    filteredEvents = filteredEvents.filter(e => e.type === filters.type);
  }
  if (filters?.location) {
    filteredEvents = filteredEvents.filter(e => 
      e.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  if (filters?.priceCategory) {
    filteredEvents = filteredEvents.filter(e => e.priceCategory === filters.priceCategory);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredEvents = filteredEvents.filter(e =>
      e.title.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search)
    );
  }

  return filteredEvents;
}