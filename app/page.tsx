import FeaturedEvents from "@/components/featured-events";
import AdBanner from "@/components/ads/ad-banner";
import CategoryMenu from "@/components/category-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-20 md:py-32">
        {/* ... existing hero content ... */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Pattaya's
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Best Events
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              From beach parties to live music, find everything happening in Thailand's entertainment capital
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 h-14">
                  <Calendar className="w-5 h-5 mr-2" />
                  Browse All Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/venues">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 h-14"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Venues
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-1">500+</div>
                <div className="text-blue-200 text-sm">Events</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">100+</div>
                <div className="text-blue-200 text-sm">Venues</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-1">50K+</div>
                <div className="text-blue-200 text-sm">Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

 {/* Header Ad Banner */}
      <AdBanner position="header" page="home" />

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Are You Looking For?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickLinkCard
              icon={<Calendar className="w-8 h-8" />}
              title="Tonight's Events"
              description="See what's happening today"
              href="/events?dateRange=today"
              color="from-blue-500 to-cyan-500"
            />
            <QuickLinkCard
              icon={<Users className="w-8 h-8" />}
              title="Popular Venues"
              description="Most visited spots in Pattaya"
              href="/venues"
              color="from-purple-500 to-pink-500"
            />
            <QuickLinkCard
              icon={<MapPin className="w-8 h-8" />}
              title="Beach Parties"
              description="Best beach events and parties"
              href="/events?category=beach-parties"
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>
      {/* Footer Ad Banner */}
      <AdBanner position="footer" page="home" />
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Never Miss an Event
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get notified about new events, exclusive deals, and special happenings in Pattaya
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-lg px-8 h-14">
            Subscribe to Updates
          </Button>
        </div>
      </section>
    </div>
  );
}

// Quick Link Card Component
function QuickLinkCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300">
        <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
          Learn more
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}