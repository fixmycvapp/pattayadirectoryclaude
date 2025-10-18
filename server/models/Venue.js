const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
       maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['restaurant', 'bar', 'club', 'cafe', 'street-food', 'fine-dining', 'rooftop-bar', 'beach-club'],
      index: true,
    },
    cuisine: [{
      type: String,
      enum: ['thai', 'international', 'seafood', 'italian', 'japanese', 'chinese', 'indian', 'mexican', 'fusion'],
    }],
    location: {
      area: {
        type: String,
        required: true,
        enum: ['beach-road', 'jomtien', 'naklua', 'pratumnak', 'central-pattaya', 'walking-street', 'soi-buakhao'],
        index: true,
      },
      address: {
        type: String,
        required: true,
      },
      latitude: Number,
      longitude: Number,
    },
    priceRange: {
      type: String,
      enum: ['budget', 'moderate', 'expensive', 'fine-dining'],
      required: true,
      index: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    images: {
      main: {
        type: String,
        required: true,
      },
      gallery: [String],
    },
    description: {
      short: {
        type: String,
        required: true,
        maxlength: 300,
      },
      full: String,
    },
    openHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    features: [{
      type: String,
      enum: [
        'live-music', 'dj', 'outdoor-seating', 'air-conditioned',
        'wifi', 'parking', 'reservations', 'delivery', 'happy-hour',
        'rooftop', 'beach-view', 'pool', 'smoking-area', 'vegan-options'
      ],
    }],
    contact: {
      phone: String,
      email: String,
      website: String,
      facebook: String,
      instagram: String,
      line: String,
    },
    mapUrl: String,
    menuUrl: String,
    tags: [String],
    
    // Status
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    
    // SEO
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    
    // Stats
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }

    type: {
      type: String,
      required: [true, 'Venue type is required'],
      enum: ['club', 'bar', 'restaurant', 'theater', 'hotel', 'beach-club', 'other'],
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    capacity: {
      type: Number,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'temporarily-closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
venueSchema.index({ name: 'text', address: 'text' });
venueSchema.index({ type: 1 });
venueSchema.index({ rating: -1 });
venueSchema.index({ latitude: 1, longitude: 1 });
venueSchema.index({ category: 1, 'location.area': 1 });
venueSchema.index({ featured: -1, 'rating.average': -1 });

// Generate slug
venueSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Find nearby venues
venueSchema.statics.findNearby = function(latitude, longitude, radiusKm = 3) {
  const earthRadiusKm = 6371;
  const latDelta = radiusKm / earthRadiusKm * (180 / Math.PI);
  const lonDelta = radiusKm / earthRadiusKm * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);

  return this.find({
    'location.latitude': { $gte: latitude - latDelta, $lte: latitude + latDelta },
    'location.longitude': { $gte: longitude - lonDelta, $lte: longitude + lonDelta },
    active: true,
  }).sort({ 'rating.average': -1 });
};


module.exports = mongoose.model('Venue', venueSchema);