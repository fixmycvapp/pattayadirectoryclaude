import { Event, FilterParams, EventDetail } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface EventsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Event[];
}

// Get all events with filters
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
    throw error;
  }
}

// Get single event by ID
export async function getEvent(id: string): Promise<EventDetail | null> {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

// Increment event view count
export async function incrementEventView(eventId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to increment view count");
    }
  } catch (error) {
    console.error("Error incrementing view:", error);
  }
}

// Create new event (admin only)
export async function createEvent(
  event: Partial<EventDetail>,
  token: string
): Promise<EventDetail | null> {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}

// Update event (admin only)
export async function updateEvent(
  id: string,
  event: Partial<EventDetail>,
  token: string
): Promise<EventDetail | null> {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error("Failed to update event");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
}

// Delete event (admin only)
export async function deleteEvent(
  id: string,
  token: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}