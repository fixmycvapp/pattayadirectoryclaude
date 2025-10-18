"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hotel,
  UtensilsCrossed,
  Bus,
  Newspaper,
  PartyPopper,
  RefreshCw,
  Loader2,
  Clock,
  Thermometer,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LocationSelector from "./LocationSelector";
import AccommodationCard from "./AccommodationCard";
import VenueCard from "./VenueCard";
import NewsCard from "./NewsCard";
import EventCard from "./event-card";
import { getNearbyData, getSmartSuggestions } from "@/lib/getNearbyData";

export default function TouristDashboard() {
  const [location, setLocation] = useState('central-pattaya');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('stay');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const smartSuggestion = getSmartSuggestions();

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pattaya-dashboard-bookmarks');
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      localStorage.setItem('pattaya-dashboard-bookmarks', JSON.stringify([...newBookmarks]));
      return newBookmarks;
    });
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const nearbyData = await getNearbyData(location, 
        coordinates ? { latitude: coordinates.lat, longitude: coordinates.lng, area: location } : undefined
      );
      setData(nearbyData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [location, coordinates]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 600000); // 10 minutes // Change 600000 to desired ms

    return () => clearInterval(interval);
  }, [location, coordinates]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          <LocationSelector
            value={location}
            onChange={handleLocationChange}
            onCoordinatesChange={handleCoordinatesChange}
          />

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Weather Widget */}
        {data?.weather && (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <Thermometer className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-semibold">
                {Math.round(data.weather.main.temp)}°C
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {data.weather.weather[0].description}
              </div>
            </div>
          </div>
        )}

        {/* Smart Suggestion */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{smartSuggestion.type === 'nightlife' ? '🌙' : '☀️'}</div>
            <div>
              <h3 className="font-bold text-purple-900">{smartSuggestion.title}</h3>
              <p className="text-sm text-purple-700">{smartSuggestion.description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
          <TabsTrigger value="stay" className="flex items-center gap-2 py-3">
            <Hotel className="w-4 h-4" />
            <span>Stay</span>
            <Badge variant="secondary">{data?.accommodations?.length || 0}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="eat" className="flex items-center gap-2 py-3">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Eat & Party</span>
            <Badge variant="secondary">{data?.venues?.length || 0}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="events" className="flex items-center gap-2 py-3">
            <PartyPopper className="w-4 h-4" />
            <span>Events</span>
            <Badge variant="secondary">{data?.events?.length || 0}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="transport" className="flex items-center gap-2 py-3">
            <Bus className="w-4 h-4" />
            <span>Transport</span>
          </TabsTrigger>
          
          <TabsTrigger value="news" className="flex items-center gap-2 py-3">
            <Newspaper className="w-4 h-4" />
            <span>What's New</span>
            <Badge variant="secondary">{data?.news?.length || 0}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Stay Tab */}
        <TabsContent value="stay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-blue-600" />
                Accommodations Near You
              </CardTitle>
              <CardDescription>
                Find the perfect place to stay in {location.replace(/-/g, ' ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.accommodations?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.accommodations.map((accommodation: any) => (
                    <div key={accommodation._id} className="relative">
                      <button
                        onClick={() => toggleBookmark(`accommodation-${accommodation._id}`)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        {bookmarks.has(`accommodation-${accommodation._id}`) ? (
                          <BookmarkCheck className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <AccommodationCard accommodation={accommodation} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No accommodations found in this area
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eat & Party Tab */}
        <TabsContent value="eat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-purple-600" />
                Food & Nightlife Venues
              </CardTitle>
              <CardDescription>
                Discover restaurants, bars, and clubs nearby
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.venues?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.venues.map((venue: any) => (
                    <div key={venue._id} className="relative">
                      <button
                        onClick={() => toggleBookmark(`venue-${venue._id}`)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        {bookmarks.has(`venue-${venue._id}`) ? (
                          <BookmarkCheck className="w-4 h-4 text-purple-600" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <VenueCard venue={venue} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No venues found in this area
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-orange-600" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Don't miss these exciting events happening soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.events?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.events.map((event: any) => (
                    <div key={event._id} className="relative">
                      <button
                        onClick={() => toggleBookmark(`event-${event._id}`)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        {bookmarks.has(`event-${event._id}`) ? (
                          <BookmarkCheck className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No upcoming events in this area
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-green-600" />
                Getting Around {location.replace(/-/g, ' ')}
              </CardTitle>
              <CardDescription>
                Local transport options and tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.transport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bus className="w-4 h-4 text-blue-600" />
                        Baht Bus
                      </h4>
                      <p className="text-sm text-gray-700">{data.transport.bahtBus}</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Motorbike Taxi</h4>
                      <p className="text-sm text-gray-700">{data.transport.motorbikeTaxi}</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Parking</h4>
                      <p className="text-sm text-gray-700">{data.transport.parking}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold mb-2">💡 Local Tips</h4>
                    <ul className="space-y-1">
                      {data.transport.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Transport information unavailable
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-gray-900" />
                Latest Pattaya News
              </CardTitle>
              <CardDescription>
                Stay informed about local updates and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data?.news?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.news.map((article: any) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No news articles available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}