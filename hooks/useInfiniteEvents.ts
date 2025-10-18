"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Event, FilterParams } from "@/lib/types";

interface UseInfiniteEventsProps {
  initialFilters?: FilterParams;
  limit?: number;
  autoRefreshInterval?: number; // milliseconds (default: 60000 = 60s)
}

interface InfiniteEventsState {
  events: Event[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  newEventsAvailable: boolean;
  fetchMore: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  dismissNewEvents: () => void;
}

export function useInfiniteEvents({
  initialFilters = {},
  limit = 12,
  autoRefreshInterval = 60000, // 60 seconds default
}: UseInfiniteEventsProps = {}): InfiniteEventsState {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEventsAvailable, setNewEventsAvailable] = useState(false);
  const [offset, setOffset] = useState(0);
  
  const filtersRef = useRef(initialFilters);
  const isFetchingRef = useRef(false);
  const latestEventIdRef = useRef<string | null>(null);
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Fetch events from API
  const fetchEvents = useCallback(async (
    currentOffset: number,
    shouldAppend: boolean = false
  ): Promise<void> => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: currentOffset.toString(),
        sort: 'date',
        status: 'published',
        ...filtersRef.current,
      });

      const response = await fetch(`${apiUrl}/events?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const fetchedEvents = data.data || [];
      const total = data.total || 0;

      // Update latest event ID for auto-refresh comparison
      if (fetchedEvents.length > 0 && !shouldAppend) {
        latestEventIdRef.current = fetchedEvents[0]._id || fetchedEvents[0].id;
      }

      if (shouldAppend) {
        setEvents(prev => [...prev, ...fetchedEvents]);
      } else {
        setEvents(fetchedEvents);
      }

      // Check if there are more events to load
      const newHasMore = currentOffset + fetchedEvents.length < total;
      setHasMore(newHasMore);

    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [apiUrl, limit]);

  // Check for new events (for auto-refresh)
  const checkForNewEvents = useCallback(async (): Promise<void> => {
    if (!latestEventIdRef.current) return;

    try {
      const response = await fetch(
        `${apiUrl}/events?limit=1&sort=date&status=published`,
        {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      const latestEvent = data.data?.[0];

      if (latestEvent) {
        const latestId = latestEvent._id || latestEvent.id;
        
        // If the latest event ID is different, new events are available
        if (latestId !== latestEventIdRef.current) {
          setNewEventsAvailable(true);
        }
      }
    } catch (err) {
      console.error('Error checking for new events:', err);
    }
  }, [apiUrl]);

  // Load more events (infinite scroll)
  const fetchMore = useCallback(async (): Promise<void> => {
    if (!hasMore || loading) return;
    
    const newOffset = offset + limit;
    setOffset(newOffset);
    await fetchEvents(newOffset, true);
  }, [hasMore, loading, offset, limit, fetchEvents]);

  // Refresh events (manual or auto)
  const refreshEvents = useCallback(async (): Promise<void> => {
    setOffset(0);
    setNewEventsAvailable(false);
    await fetchEvents(0, false);
  }, [fetchEvents]);

  // Dismiss new events notification
  const dismissNewEvents = useCallback(() => {
    setNewEventsAvailable(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchEvents(0, false);
  }, [fetchEvents]);

  // Setup auto-refresh polling
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      autoRefreshTimerRef.current = setInterval(() => {
        checkForNewEvents();
      }, autoRefreshInterval);

      return () => {
        if (autoRefreshTimerRef.current) {
          clearInterval(autoRefreshTimerRef.current);
        }
      };
    }
  }, [autoRefreshInterval, checkForNewEvents]);

  // Update filters ref when they change
  useEffect(() => {
    filtersRef.current = initialFilters;
    setOffset(0);
    fetchEvents(0, false);
  }, [initialFilters, fetchEvents]);

  return {
    events,
    loading,
    hasMore,
    error,
    newEventsAvailable,
    fetchMore,
    refreshEvents,
    dismissNewEvents,
  };
}