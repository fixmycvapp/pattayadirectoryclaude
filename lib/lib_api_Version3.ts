// ... existing code ...

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