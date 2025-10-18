import Hero from "@/components/home/hero";
import FilterBar from "@/components/home/filter-bar";
import FeaturedEvents from "@/components/home/featured-events";
import CategorySection from "@/components/home/category-section";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Filter Bar */}
      <FilterBar />

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Category Section */}
      <CategorySection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}