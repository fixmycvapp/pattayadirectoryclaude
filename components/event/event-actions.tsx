"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Bell, Share2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
}

export default function EventActions({
  eventId,
  eventTitle,
  eventDate,
}: EventActionsProps) {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");

  // Check if event is favorited/has reminder on mount
  useEffect(() => {
    if (session?.user) {
      checkUserInteractions();
    }
  }, [session]);

  const checkUserInteractions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users/me/interactions/${eventId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite || false);
        setHasReminder(data.hasReminder || false);
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save events to your favorites.",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return;
    }

    setLoadingFavorite(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const endpoint = isFavorite
        ? `${apiUrl}/users/favorites/${eventId}`
        : `${apiUrl}/users/favorites`;

      const response = await fetch(endpoint, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: isFavorite ? undefined : JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }

      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);

      toast({
        title: newFavoriteState ? "❤️ Added to favorites!" : "Removed from favorites",
        description: newFavoriteState
          ? "Event saved to your profile"
          : "Event removed from your favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleReminderClick = () => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to set event reminders.",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return;
    }

    if (hasReminder) {
      // Remove reminder
      handleRemoveReminder();
    } else {
      // Show reminder dialog
      // Pre-fill with 1 day before event
      const eventDateObj = new Date(eventDate);
      const oneDayBefore = new Date(eventDateObj);
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);
      setReminderDate(oneDayBefore.toISOString().split('T')[0]);
      setShowReminderDialog(true);
    }
  };

  const handleSetReminder = async () => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time for the reminder.",
        variant: "destructive",
      });
      return;
    }

    setLoadingReminder(true);

    try {
      const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/users/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          eventId,
          reminderDate: reminderDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set reminder');
      }

      setHasReminder(true);
      setShowReminderDialog(false);

      toast({
        title: "🔔 Reminder set!",
        description: `We'll remind you on ${reminderDateTime.toLocaleDateString()} at ${reminderTime}`,
      });
    } catch (error) {
      console.error('Error setting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to set reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingReminder(false);
    }
  };

  const handleRemoveReminder = async () => {
    setLoadingReminder(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/users/reminders/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove reminder');
      }

      setHasReminder(false);

      toast({
        title: "Reminder removed",
        description: "You won't receive notifications for this event.",
      });
    } catch (error) {
      console.error('Error removing reminder:', error);
      toast({
        title: "Error",
        description: "Failed to remove reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingReminder(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* Favorite Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleFavoriteToggle}
            disabled={loadingFavorite}
            variant={isFavorite ? "default" : "outline"}
            className={`relative ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            }`}
          >
            {loadingFavorite ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <motion.div
                animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
                />
              </motion.div>
            )}
            {isFavorite ? "Saved" : "Save Event"}
          </Button>
        </motion.div>

        {/* Reminder Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleReminderClick}
            disabled={loadingReminder}
            variant={hasReminder ? "default" : "outline"}
            className={`relative ${
              hasReminder
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            }`}
          >
            {loadingReminder ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <motion.div
                animate={hasReminder ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Bell
                  className={`w-4 h-4 mr-2 ${hasReminder ? "fill-current" : ""}`}
                />
              </motion.div>
            )}
            {hasReminder ? "Reminder Set" : "Set Reminder"}
          </Button>
        </motion.div>

        {/* Share Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: eventTitle,
                  text: `Check out this event: ${eventTitle}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied!",
                  description: "Event link copied to clipboard",
                });
              }
            }}
            variant="outline"
            className="hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>
      </div>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Event Reminder</DialogTitle>
            <DialogDescription>
              Choose when you'd like to be reminded about this event
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reminder-date">Reminder Date</Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
                max={eventDate}
              />
            </div>

            <div>
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Event Date:</strong>{" "}
                {new Date(eventDate).toLocaleDateString()} at{" "}
                {new Date(eventDate).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowReminderDialog(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetReminder}
              disabled={loadingReminder}
              className="flex-1 bg-gradient-tropical"
            >
              {loadingReminder ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Set Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}