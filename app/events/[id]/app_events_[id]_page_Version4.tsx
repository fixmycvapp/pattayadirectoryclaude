import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from '@/components/event/event-detail-client';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${params.id}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return {
        title: 'Event Not Found - Pattaya Directory',
      };
    }

    const data = await response.json();
    const event = data.data || data;

    return {
      title: `${event.title} - Pattaya Directory`,
      description: event.description.substring(0, 160),
      openGraph: {
        title: event.title,
        description: event.description,
        images: event.imageUrl ? [event.imageUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: event.description,
        images: event.imageUrl ? [event.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Event Not Found - Pattaya Directory',
    };
  }
}

// Server component to fetch data
async function getEventData(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventData(params.id);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}