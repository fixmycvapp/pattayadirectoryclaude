"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bell, User, Loader2, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import EventCard from "@/components/event-card";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [reminders, setReminders] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"favorites" | "reminders">("favorites");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user's favorites and reminders
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        setReminders(data.reminders || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-teal-600 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {session?.user?.name || "My Profile"}
              </h1>
              <p className="text-blue-100">
                {session?.user?.email}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-4 px-4 font-semibold transition-colors relative ${
                activeTab === "favorites"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Saved Events ({favorites.length})
              </div>
              {activeTab === "favorites" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("reminders")}
              className={`pb-4 px-4 font-semibold transition-colors relative ${
                activeTab === "reminders"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Reminders ({reminders.length})
              </div>
              {activeTab === "reminders" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No saved events yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start saving events you're interested in!
                    </p>
                    <Button asChild>
                      <a href="/events">
                        <Calendar className="w-4 h-4 mr-2" />
                        Browse Events
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((event) => (
                      <EventCard key={event._id || event.id} event={event} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "reminders" && (
              <motion.div
                key="reminders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {reminders.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No reminders set
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Set reminders so you don't miss your favorite events!
                    </p>
                    <Button asChild>
                      <a href="/events">
                        <Calendar className="w-4 h-4 mr-2" />
                        Browse Events
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reminders.map((event) => (
                      <EventCard key={event._id || event.id} event={event} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";