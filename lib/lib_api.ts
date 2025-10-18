import { Event, FilterParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getEvents(filters?: FilterParams): Promise<Event[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const url = `${API_URL}/events?${queryParams.toString()}`;
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
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

    return response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function createEvent(event: Partial<Event>): Promise<Event | null> {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}