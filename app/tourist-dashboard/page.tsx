import { Metadata } from "next";
import TouristDashboard from "@/components/TouristDashboard";

export const metadata: Metadata = {
  title: "Tourist Dashboard - Explore Pattaya | Pattaya Directory",
  description: "Your personalized dashboard to explore Pattaya - find nearby hotels, restaurants, nightlife, transport info, and latest news all in one place.",
  keywords: "Pattaya, tourist guide, hotels, restaurants, nightlife, transport, news, Thailand tourism",
};

export default function TouristDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-coral-500 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Explore Pattaya Like a Local 🇹🇭
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Your personalized guide to the best hotels, food, nightlife, and local tips
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                📍 Location-Aware
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                🔄 Auto-Refresh
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                💾 Save Favorites
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                🤖 Smart Suggestions
              </div>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#f8fafc"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 -mt-12 relative z-20">
        <div className="container-custom">
          <TouristDashboard />
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold mb-2">Use Your Location</h3>
              <p className="text-sm text-gray-600">
                Enable location services for personalized nearby recommendations
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-3">💾</div>
              <h3 className="font-semibold mb-2">Save Favorites</h3>
              <p className="text-sm text-gray-600">
                Bookmark places to build your personal Pattaya itinerary
              </p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600">
                Dashboard auto-refreshes every 10 minutes with latest info
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}