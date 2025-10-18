import SearchBar from "@/components/search-bar";
import FeaturedEvents from "@/components/featured-events";
import { Calendar, MapPin, Ticket, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20 md:py-32">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Pattaya's Best Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              From beach concerts to night markets, find everything happening in Pattaya
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Daily Events</h3>
              <p className="text-gray-600">Updated event listings every day</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">All Locations</h3>
              <p className="text-gray-600">Events across all Pattaya districts</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book tickets directly online</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-tropical rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Trending Now</h3>
              <p className="text-gray-600">See what's popular this week</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-slate-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Events
          </h2>
          <FeaturedEvents />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Pattaya?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of locals and tourists discovering the best events in Pattaya
          </p>
          <a href="/events" className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:shadow-lg transition-all">
            Browse All Events
          </a>
        </div>
      </section>
    </div>
  );
}