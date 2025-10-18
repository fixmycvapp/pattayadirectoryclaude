const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Accommodation name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Accommodation type is required'],
      enum: ['hotel', 'hostel', 'condo', 'apartment', 'resort', 'guesthouse', 'villa'],
      index: true,
    },
    location: {
      area: {
        type: String,
        required: [true, 'Area is required'],
        enum: ['beach-road', 'jomtien', 'naklua', 'pratumnak', 'central-pattaya', 'north-pattaya', 'south-pattaya', 'walking-street'],
        index: true,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    priceRange: {
      min: {
        type: Number,
        required: [true, 'Minimum price is required'],
        min: 0,
      },
      max: {
        type: Number,
        required: [true, 'Maximum price is required'],
        min: 0,
      },
      currency: {
        type: String,
        default: 'THB',
      },
      priceCategory: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury', 'ultra-luxury'],
        required: true,
        index: true,
      },
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
        required: [true, 'Main image is required'],
      },
      gallery: [String],
    },
    description: {
      short: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [300, 'Short description cannot exceed 300 characters'],
      },
      full: {
        type: String,
        required: [true, 'Full description is required'],
      },
    },
    amenities: [{
      type: String,
      enum: [
        'wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar', 'parking',
        'beach-access', 'airport-shuttle', 'room-service', 'laundry',
        'breakfast', 'air-conditioning', 'tv', 'minibar', 'safe',
        'balcony', 'kitchen', 'pet-friendly'
      ],
    }],
    rooms: {
      total: Number,
      types: [{
        name: String,
        capacity: Number,
        price: Number,
      }],
    },
    contact: {
      phone: {
        type: String,
        required: true,
      },
      email: String,
      website: String,
      facebook: String,
      instagram: String,
    },
    mapUrl: {
      type: String,
    },
    bookingUrl: String,
    
    // SEO
    slug: {
      type: String,
      unique: true,
      index: true,
    },
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
    
    // Stats
    views: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
accommodationSchema.index({ 'location.area': 1, 'priceRange.priceCategory': 1 });
accommodationSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
accommodationSchema.index({ featured: -1, 'rating.average': -1 });

// Generate slug before saving
accommodationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to find nearby accommodations
accommodationSchema.statics.findNearby = function(latitude, longitude, radiusKm = 5) {
  const earthRadiusKm = 6371;
  const latDelta = radiusKm / earthRadiusKm * (180 / Math.PI);
  const lonDelta = radiusKm / earthRadiusKm * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);

  return this.find({
    'location.latitude': { $gte: latitude - latDelta, $lte: latitude + latDelta },
    'location.longitude': { $gte: longitude - lonDelta, $lte: longitude + lonDelta },
    active: true,
  }).sort({ 'rating.average': -1 });
};

module.exports = mongoose.model('Accommodation', accommodationSchema);