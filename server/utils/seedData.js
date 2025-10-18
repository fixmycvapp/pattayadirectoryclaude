const Accommodation = require('../models/Accommodation');
const Venue = require('../models/Venue');
const NewsArticle = require('../models/NewsArticle');

const accommodationData = [
  {
    name: "Hilton Pattaya",
    type: "hotel",
    location: {
      area: "central-pattaya",
      address: "333/101 Moo 9, Beach Road",
      latitude: 12.9236,
      longitude: 100.8825,
    },
    priceRange: {
      min: 3500,
      max: 8000,
      currency: "THB",
      priceCategory: "luxury",
    },
    rating: { average: 4.6, count: 1250 },
    images: {
      main: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      gallery: [],
    },
    description: {
      short: "Luxury beachfront hotel with stunning views and world-class amenities",
      full: "Experience ultimate luxury at Hilton Pattaya...",
    },
    amenities: ["wifi", "pool", "gym", "spa", "restaurant", "bar", "beach-access"],
    contact: {
      phone: "+66-38-253-000",
      email: "info@hiltonpattaya.com",
      website: "https://www.hilton.com/pattaya",
    },
    verified: true,
    featured: true,
    active: true,
  },
  // Add more...
];

const venueData = [
  {
    name: "The Sky Gallery Pattaya",
    category: "rooftop-bar",
    cuisine: ["international", "fusion"],
    location: {
      area: "central-pattaya",
      address: "Hilton Pattaya, 34th Floor",
      latitude: 12.9236,
      longitude: 100.8825,
    },
    priceRange: "expensive",
    rating: { average: 4.7, count: 890 },
    images: {
      main: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
    },
    description: {
      short: "Stunning rooftop bar with panoramic ocean views and craft cocktails",
    },
    openHours: {
      monday: { open: "17:00", close: "02:00" },
      tuesday: { open: "17:00", close: "02:00" },
      wednesday: { open: "17:00", close: "02:00" },
      thursday: { open: "17:00", close: "02:00" },
      friday: { open: "17:00", close: "03:00" },
      saturday: { open: "17:00", close: "03:00" },
      sunday: { open: "17:00", close: "02:00" },
    },
    features: ["rooftop", "beach-view", "live-music", "wifi", "reservations"],
    contact: {
      phone: "+66-38-253-000",
    },
    verified: true,
    featured: true,
    active: true,
  },
  // Add more...
];

const newsData = [
  {
    title: "Pattaya Music Festival 2025 Announced",
    summary: "The annual Pattaya International Music Festival returns with international artists and free admission for all.",
    content: "Full article content here...",
    category: "events",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    author: { name: "Pattaya Directory" },
    publishedAt: new Date(),
    status: "published",
    featured: true,
    priority: "high",
  },
  // Add more...
];

async function seedDatabase() {
  try {
    await Accommodation.deleteMany({});
    await Venue.deleteMany({});
    await NewsArticle.deleteMany({});

    await Accommodation.insertMany(accommodationData);
    await Venue.insertMany(venueData);
    await NewsArticle.insertMany(newsData);

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = seedDatabase;