const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const Location = require('../models/Location');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '../.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const events = [
  {
    title: 'Pattaya Beach Music Festival 2025',
    description: `Join us for the biggest beach music festival in Pattaya! Featuring international DJs, live bands, and beachfront performances.

Experience world-class entertainment with stunning ocean views. This year's lineup includes Grammy-winning artists, local Thai performers, and electronic music pioneers.

Event Highlights:
• 3 Main Stages with non-stop music
• 50+ International & Local Artists
• Beachfront Food & Beverage Pavilions
• VIP Lounge with Premium Services
• Fire Shows & Light Displays
• After-party until 4 AM

Don't miss the event of the year!`,
    date: new Date('2025-12-15T18:00:00Z'),
    time: '18:00',
    location: 'Beach Road Central Stage',
    address: 'Beach Road, Central Pattaya, Chonburi 20150, Thailand',
    latitude: 12.9280,
    longitude: 100.8778,
    type: 'concert',
    price: 1500,
    priceCategory: 'moderate',
    images: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
      'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=1200',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    ticketUrl: 'https://www.ticketmaster.com/pattaya-beach-festival',
    organizer: 'Pattaya Events Co., Ltd.',
    contactEmail: 'info@pattayabeachfestival.com',
    contactPhone: '+66 38 123 4567',
    website: 'https://www.pattayabeachfestival.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/PattayaBeachFestival',
      instagram: 'https://www.instagram.com/pattayabeachfest',
      tiktok: 'https://www.tiktok.com/@pattayabeachfest',
      youtube: 'https://www.youtube.com/pattayabeachfest'
    },
    views: 1250,
    featured: true,
    status: 'published',
    capacity: 5000,
    attendees: 1200,
    tags: ['music', 'beach', 'festival', 'international', 'EDM', 'live-band'],
    highlights: [
      '50+ International Artists',
      '3 Main Stages',
      'VIP Lounge Access',
      'Beachfront Location',
      'Fire Shows & Entertainment'
    ],
    requirements: [
      'Valid ID required',
      'No outside food or drinks',
      'Bags will be checked at entrance'
    ],
    ageRestriction: '18+',
    dresscode: 'Casual beach wear'
  },
  {
    title: 'Walking Street Night Market',
    description: `Experience authentic Thai street food, local handicrafts, and live entertainment at Pattaya's most famous night market.

Over 100 vendors selling everything from traditional Thai cuisine to unique souvenirs. Live music performances every night, cultural shows, and a vibrant atmosphere that captures the spirit of Pattaya.

What to Expect:
• 100+ Food & Shopping Vendors
• Live Thai Music & Dance Performances
• Traditional Handicrafts & Souvenirs
• Local Street Food Delicacies
• Family-Friendly Atmosphere
• Open Every Night

Free entry for everyone!`,
    date: new Date('2025-10-25T17:00:00Z'),
    time: '17:00',
    location: 'Walking Street',
    address: 'Walking Street, South Pattaya, Bang Lamung, Chonburi 20150, Thailand',
    latitude: 12.9236,
    longitude: 100.8808,
    type: 'market',
    price: 0,
    priceCategory: 'free',
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200',
    videoUrl: 'https://www.youtube.com/embed/lHW8C8e0mAk',
    organizer: 'Walking Street Association',
    contactEmail: 'info@walkingstreetmarket.com',
    contactPhone: '+66 38 234 5678',
    website: 'https://www.walkingstreetpattaya.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/WalkingStreetPattaya',
      instagram: 'https://www.instagram.com/walkingstreetpattaya'
    },
    views: 890,
    featured: true,
    status: 'published',
    tags: ['market', 'food', 'shopping', 'nightlife', 'culture'],
    highlights: [
      '100+ Vendors',
      'Live Entertainment',
      'Traditional Thai Food',
      'Handmade Crafts',
      'Free Entry'
    ],
    ageRestriction: 'all-ages'
  },
  {
    title: 'Songkran Water Festival 2026',
    description: `Celebrate Thai New Year with the biggest water fight in Pattaya!

Join thousands of locals and tourists in this traditional festival featuring water splashing, music, dance, and street parties. The entire city transforms into one giant celebration of Thai culture and traditions.

Festival Activities:
• Traditional Water Splashing
• Street Parties & Live Music
• Thai Cultural Performances
• Food Stalls & Market
• Foam Parties
• Parade & Traditional Ceremonies

Bring your water guns and get ready for the most fun you'll have in Thailand!`,
    date: new Date('2026-04-13T10:00:00Z'),
    time: '10:00',
    location: 'Central Pattaya',
    address: 'Central Pattaya Road, Pattaya City, Chonburi 20150, Thailand',
    latitude: 12.9349,
    longitude: 100.8814,
    type: 'festival',
    price: 0,
    priceCategory: 'free',
    images: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
    videoUrl: 'https://www.youtube.com/embed/g8qFIABLwLM',
    organizer: 'Pattaya City Municipality',
    contactEmail: 'songkran@pattayacity.go.th',
    contactPhone: '+66 38 345 6789',
    website: 'https://www.pattayacity.go.th/songkran',
    socialLinks: {
      facebook: 'https://www.facebook.com/PattayaCityOfficial',
      instagram: 'https://www.instagram.com/pattayacity',
      twitter: 'https://www.twitter.com/pattayacity'
    },
    views: 2100,
    featured: true,
    status: 'published',
    capacity: 10000,
    attendees: 0,
    tags: ['festival', 'culture', 'tradition', 'water', 'thai-new-year'],
    highlights: [
      'City-Wide Celebration',
      'Traditional Water Splashing',
      'Live Music Stages',
      'Cultural Performances',
      'Free for Everyone'
    ],
    requirements: [
      'Wear clothes you don\'t mind getting wet',
      'Waterproof bags recommended',
      'Respect local customs and traditions'
    ],
    ageRestriction: 'family-friendly'
  },
  {
    title: 'Muay Thai Championship Finals',
    description: `Watch Thailand's best Muay Thai fighters compete for the championship title.

Witness intense matches, traditional ceremonies, and world-class martial arts in this prestigious event. Experience the ancient art of eight limbs as elite fighters battle for glory.

Championship Features:
• 10 Championship Matches
• Traditional Wai Kru Ceremony
• International & Local Champions
• Expert Commentary
• VIP Ringside Seats Available
• Traditional Thai Music

An unforgettable evening of authentic Thai martial arts!`,
    date: new Date('2025-11-20T19:00:00Z'),
    time: '19:00',
    location: 'Jomtien Beach Stadium',
    address: 'Jomtien Beach Road, Pattaya, Chonburi 20150, Thailand',
    latitude: 12.8945,
    longitude: 100.8765,
    type: 'sports',
    price: 800,
    priceCategory: 'budget',
    images: [
      'https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=1200',
      'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=1200',
    videoUrl: 'https://www.youtube.com/embed/R6cZPl2hxnk',
    ticketUrl: 'https://www.muaythaitickets.com/pattaya-championship',
    organizer: 'Pattaya Muay Thai Association',
    contactEmail: 'tickets@pattayamuaythai.com',
    contactPhone: '+66 38 456 7890',
    website: 'https://www.pattayamuaythai.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/PattayaMuayThai',
      instagram: 'https://www.instagram.com/pattayamuaythai',
      youtube: 'https://www.youtube.com/pattayamuaythai'
    },
    views: 675,
    featured: false,
    status: 'published',
    capacity: 2000,
    attendees: 450,
    tags: ['sports', 'muaythai', 'martial-arts', 'championship', 'thailand'],
    highlights: [
      '10 Championship Bouts',
      'Traditional Ceremonies',
      'World-Class Fighters',
      'VIP Seating Available',
      'Live Commentary'
    ],
    requirements: [
      'Tickets required',
      'No weapons or dangerous items',
      'Respect the traditional ceremonies'
    ],
    ageRestriction: 'all-ages',
    dresscode: 'Smart casual'
  },
  {
    title: 'Pattaya Jazz Festival',
    description: `An evening of smooth jazz under the stars featuring renowned international and local jazz musicians.

Enjoy fine wine, gourmet food, and world-class performances in an intimate venue overlooking Pattaya Bay. This premium event brings together the best jazz artists from around the world.

Festival Lineup:
• 5 International Jazz Ensembles
• Local Thai Jazz Bands
• Wine & Gourmet Food Pairing
• Intimate Venue Setting
• VIP Meet & Greet Available
• Premium Sound System

A sophisticated evening for jazz enthusiasts!`,
    date: new Date('2025-12-01T19:30:00Z'),
    time: '19:30',
    location: 'Pratumnak Hill Viewpoint',
    address: 'Pratumnak Hill, Pattaya, Chonburi 20150, Thailand',
    latitude: 12.9156,
    longitude: 100.8698,
    type: 'concert',
    price: 2500,
    priceCategory: 'premium',
    images: [
      'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200',
      'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=1200',
    videoUrl: 'https://www.youtube.com/embed/vmDDOFXSgAs',
    ticketUrl: 'https://www.pattayajazzfestival.com/tickets',
    organizer: 'Pattaya Jazz Society',
    contactEmail: 'info@pattayajazzfestival.com',
    contactPhone: '+66 38 567 8901',
    website: 'https://www.pattayajazzfestival.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/PattayaJazzFestival',
      instagram: 'https://www.instagram.com/pattayajazz',
      youtube: 'https://www.youtube.com/pattayajazz'
    },
    views: 420,
    featured: false,
    status: 'published',
    capacity: 800,
    attendees: 250,
    tags: ['jazz', 'music', 'concert', 'premium', 'fine-dining'],
    highlights: [
      'International Artists',
      'Wine & Food Pairing',
      'Scenic Viewpoint',
      'Premium Experience',
      'VIP Meet & Greet'
    ],
    requirements: [
      'Premium tickets required',
      'Smart casual dress code',
      'No outside food or drinks'
    ],
    ageRestriction: '21+',
    dresscode: 'Smart casual / Semi-formal'
  },
  {
    title: 'Loy Krathong Festival',
    description: `Experience the magical Loy Krathong festival where thousands of floating lanterns light up the night sky and water.

Traditional performances, food stalls, and cultural activities celebrate one of Thailand's most beautiful festivals. Release your own krathong and make a wish under the full moon.

Festival Activities:
• Floating Lantern Release
• Traditional Thai Performances
• Krathong Making Workshop
• Cultural Exhibitions
• Thai Food Market
• Beauty Pageant
• Fireworks Display

A night of magic and Thai traditions!`,
    date: new Date('2025-11-05T18:00:00Z'),
    time: '18:00',
    location: 'Naklua Beach',
    address: 'Naklua Beach, North Pattaya, Chonburi 20150, Thailand',
    latitude: 12.9580,
    longitude: 100.8850,
    type: 'cultural',
    price: 0,
    priceCategory: 'free',
    images: [
      'https://images.unsplash.com/photo-1548033952-31b430e1ee36?w=1200',
      'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=1200'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1548033952-31b430e1ee36?w=1200',
    videoUrl: 'https://www.youtube.com/embed/gPHgRp70H8o',
    organizer: 'Naklua Cultural Center',
    contactEmail: 'loykrathong@naklua.com',
    contactPhone: '+66 38 678 9012',
    website: 'https://www.pattayaloykrathong.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/PattayaLoyKrathong',
      instagram: 'https://www.instagram.com/loykrathongpattaya'
    },
    views: 980,
    featured: true,
    status: 'published',
    tags: ['culture', 'tradition', 'lanterns', 'festival', 'thai-culture'],
    highlights: [
      'Floating Lanterns',
      'Traditional Ceremonies',
      'Cultural Performances',
      'Free Entry',
      'Fireworks Show'
    ],
    requirements: [
      'Biodegradable krathongs only',
      'Respect religious ceremonies',
      'No littering'
    ],
    ageRestriction: 'family-friendly'
  }
];

const locations = [
  {
    name: 'Beach Road',
    address: 'Beach Road, Pattaya City, Chonburi 20150',
    coordinates: { lat: 12.9280, lng: 100.8778 },
    description: 'Main beachfront road stretching along Pattaya Bay',
    category: 'district',
    capacity: 10000,
    facilities: ['parking', 'restaurants', 'hotels', 'beach-access']
  },
  {
    name: 'Walking Street',
    address: 'Walking Street, South Pattaya, Chonburi 20150',
    coordinates: { lat: 12.9236, lng: 100.8808 },
    description: 'Famous entertainment district with bars, clubs, and restaurants',
    category: 'district',
    capacity: 5000,
    facilities: ['nightlife', 'restaurants', 'shopping', 'entertainment']
  },
  {
    name: 'Central Pattaya',
    address: 'Central Pattaya Road, Pattaya City, Chonburi 20150',
    coordinates: { lat: 12.9349, lng: 100.8814 },
    description: 'Central shopping and entertainment district',
    category: 'district',
    capacity: 15000,
    facilities: ['shopping', 'dining', 'entertainment', 'hotels']
  }
];

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Event.deleteMany();
    await Location.deleteMany();
    await User.deleteMany();
    console.log('✅ Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@pattayadirectory.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin'
    });
    console.log('✅ Created admin user');

    // Insert locations
    const createdLocations = await Location.insertMany(locations);
    console.log(`✅ Inserted ${createdLocations.length} locations`);

    // Insert events
    const eventsWithUser = events.map(event => ({
      ...event,
      createdBy: admin._id
    }));
    const createdEvents = await Event.insertMany(eventsWithUser);
    console.log(`✅ Inserted ${createdEvents.length} events`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Created ${createdEvents.length} events with full details`);
    console.log('Sample Event ID:', createdEvents[0]._id);
    console.log(`Test URL: http://localhost:5000/api/events/${createdEvents[0]._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();