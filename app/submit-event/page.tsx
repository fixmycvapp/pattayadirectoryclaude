"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, MapPin, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Validation Schema
const eventSubmissionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000),
  type: z.enum(["concert", "festival", "nightlife", "sports", "market", "cultural", "other"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required"),
  address: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  priceCategory: z.enum(["free", "budget", "moderate", "premium"]),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  organizer: z.string().optional(),
  imageUrl: z.string().optional(),
});

type EventSubmissionForm = z.infer<typeof eventSubmissionSchema>;

export default function SubmitEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EventSubmissionForm>({
    resolver: zodResolver(eventSubmissionSchema),
    defaultValues: {
      priceCategory: "free",
      price: 0,
      type: "other",
    },
  });

  const watchPrice = watch("price");

  const onSubmit = async (data: EventSubmissionForm) => {
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      // Combine date and time
      const dateTime = new Date(`${data.date}T${data.time}`);

      const eventData = {
        ...data,
        date: dateTime.toISOString(),
        status: 'draft', // Events start as draft, admin reviews them
      };

      const response = await fetch(`${apiUrl}/events/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit event');
      }

      const result = await response.json();

      setIsSuccess(true);
      toast({
        title: "✅ Event Submitted Successfully!",
        description: "Your event is under review. We'll notify you once it's approved.",
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        reset();
        setIsSuccess(false);
        router.push('/events');
      }, 3000);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "❌ Submission Failed",
        description: error.message || "Failed to submit event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // In production, upload to Cloudinary or S3
    // For now, create a local URL
    const imageUrl = URL.createObjectURL(file);
    // You would set this to the form
    console.log('Image URL:', imageUrl);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Event Submitted! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your event. Our team will review it shortly and publish it once approved.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to events page...
          </p>
        </motion.div>
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
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Add Your Event
            </h1>
            <p className="text-xl text-blue-100">
              Share your event with thousands of visitors in Pattaya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Event Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="e.g., Pattaya Beach Music Festival 2025"
                      className="mt-1"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your event, what to expect, highlights, etc."
                      rows={6}
                      className="mt-1"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Event Type */}
                  <div>
                    <Label htmlFor="type">Event Type *</Label>
                    <select
                      id="type"
                      {...register("type")}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="concert">Concert / Live Music</option>
                      <option value="festival">Festival</option>
                      <option value="nightlife">Nightlife / Club Event</option>
                      <option value="sports">Sports</option>
                      <option value="market">Market / Fair</option>
                      <option value="cultural">Cultural Event</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register("date")}
                        className="mt-1"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        {...register("time")}
                        className="mt-1"
                      />
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Location Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="location">Venue / Location Name *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="location"
                        {...register("location")}
                        placeholder="e.g., Beach Road, Walking Street"
                        className="pl-10 mt-1"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Full Address (Optional)</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Full street address"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pricing Information
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Ticket Price (THB) *</Label>
                      <Input
                        id="price"
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="0 for free events"
                        className="mt-1"
                        min="0"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="priceCategory">Price Category *</Label>
                      <select
                        id="priceCategory"
                        {...register("priceCategory")}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="free">Free</option>
                        <option value="budget">Budget (฿1-500)</option>
                        <option value="moderate">Moderate (฿501-2000)</option>
                        <option value="premium">Premium (฿2000+)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="organizer">Organizer Name</Label>
                    <Input
                      id="organizer"
                      {...register("organizer")}
                      placeholder="Your name or organization"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        {...register("contactEmail")}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                      {errors.contactEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        {...register("contactPhone")}
                        placeholder="+66 XX XXX XXXX"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website / Tickets URL</Label>
                    <Input
                      id="website"
                      type="url"
                      {...register("website")}
                      placeholder="https://your-event-website.com"
                      className="mt-1"
                    />
                    {errors.website && (
                      <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Event Image
                </h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <Label htmlFor="image" className="cursor-pointer">
                    <span className="text-blue-600 font-semibold hover:underline">
                      Upload event image
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG up to 5MB
                  </p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-tropical"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Submit Event for Review
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Your event will be reviewed within 24-48 hours
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}