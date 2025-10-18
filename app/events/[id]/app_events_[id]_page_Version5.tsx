import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from '@/components/event/event-detail-client';
import { EventDetail } from '@/lib/types';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for dynamic routes (optional - for pre-rendering popular events)
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/events?limit=20`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const events = data.data || [];

    return events.map((event: any) => ({
      id: event._id || event.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const event = await getEventData(params.id);

    if (!event) {
      return {
        title: 'Event Not Found - Pattaya Directory',
        description: 'The event you are looking for could not be found.',
      };
    }

    return {
      title: `${event.title} - Pattaya Directory`,
      description: event.description.substring(0, 160) + '...',
      keywords: [
        event.title,
        event.type,
        event.location,
        'Pattaya',
        'Thailand',
        'events',
        ...(event.tags || []),
      ],
      openGraph: {
        title: event.title,
        description: event.description.substring(0, 160),
        images: event.imageUrl ? [{ url: event.imageUrl }] : [],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: event.description.substring(0, 160),
        images: event.imageUrl ? [event.imageUrl] : [],
      },
      alternates: {
        canonical: `/events/${params.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Event Not Found - Pattaya Directory',
    };
  }
}

// Server-side data fetching with ISR
async function getEventData(id: string): Promise<EventDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  try {
    const response = await fetch(`${apiUrl}/events/${id}`, {
      next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch event: ${response.status}`);
    }

    const data = await response.json();
    const event = data.data || data;

    // Transform API response to match EventDetail interface
    return {
      ...event,
      _id: event._id || event.id,
      id: event._id || event.id,
      images: event.images || (event.imageUrl ? [event.imageUrl] : []),
      socialLinks: {
        facebook: event.socialLinks?.facebook || null,
        instagram: event.socialLinks?.instagram || null,
        twitter: event.socialLinks?.twitter || null,
        tiktok: event.socialLinks?.tiktok || null,
        youtube: event.socialLinks?.youtube || null,
      },
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

// Main page component (Server Component)
export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventData(params.id);

  if (!event) {
    notFound();
  }

  // Increment view count (fire and forget - don't await)
  incrementViewCount(params.id).catch(err => 
    console.error('Failed to increment view count:', err)
  );

  return <EventDetailClient event={event} />;
}

// Helper function to increment view count
async function incrementViewCount(eventId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  try {
    await fetch(`${apiUrl}/events/${eventId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Silently fail - view count is not critical
    console.error('View count increment failed:', error);
  }
}