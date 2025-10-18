const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      minlength: [3, 'Title must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function(value) {
          return value instanceof Date && !isNaN(value);
        },
        message: 'Please provide a valid date'
      }
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
      default: '00:00'
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    
    // Extended Location Details
    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters']
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },
    
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['concert', 'festival', 'nightlife', 'sports', 'market', 'cultural', 'other'],
        message: '{VALUE} is not a valid event type'
      },
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Event price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    priceCategory: {
      type: String,
      enum: {
        values: ['free', 'budget', 'moderate', 'premium'],
        message: '{VALUE} is not a valid price category'
      },
      default: function() {
        if (this.price === 0) return 'free';
        if (this.price <= 500) return 'budget';
        if (this.price <= 2000) return 'moderate';
        return 'premium';
      }
    },
    
    // Media
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.length <= 10;
        },
        message: 'Cannot upload more than 10 images'
      }
    },
    imageUrl: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/.test(v);
        },
        message: 'Please provide a valid video URL (YouTube, Vimeo, or Dailymotion)'
      }
    },
    
    // Booking & Tickets
    ticketUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid ticket URL'
      }
    },
    
    // Contact Information
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email address'
      }
    },
    contactPhone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid website URL'
      }
    },
    
    // Social Media Links
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?facebook\.com\/.+/.test(v);
          },
          message: 'Please provide a valid Facebook URL'
        }
      },
      instagram: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?instagram\.com\/.+/.test(v);
          },
          message: 'Please provide a valid Instagram URL'
        }
      },
      twitter: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.+/.test(v);
          },
          message: 'Please provide a valid Twitter/X URL'
        }
      },
      tiktok: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+/.test(v);
          },
          message: 'Please provide a valid TikTok URL'
        }
      },
      youtube: {
        type: String,
        trim: true,
        validate: {
          validator: function(v) {
            if (!v) return true;
            return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
          },
          message: 'Please provide a valid YouTube URL'
        }
      }
    },
    
    organizer: {
      type: String,
      trim: true,
      maxlength: [100, 'Organizer name cannot exceed 100 characters']
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'published'
    },
    capacity: {
      type: Number,
      min: 0
    },
    attendees: {
      type: Number,
      default: 0,
      min: 0
    },
    tags: {
      type: [String],
      default: []
    },
    
    // Additional Event Details
    highlights: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    ageRestriction: {
      type: String,
      enum: ['all-ages', '18+', '21+', 'family-friendly'],
      default: 'all-ages'
    },
    dresscode: {
      type: String,
      trim: true
    },
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ views: -1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ price: 1 });
eventSchema.index({ priceCategory: 1 });
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ latitude: 1, longitude: 1 });

// Compound index for geospatial queries
eventSchema.index({ latitude: 1, longitude: 1 }, { sparse: true });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.capacity && this.attendees >= this.capacity;
});

// Virtual for popularity score
eventSchema.virtual('popularityScore').get(function() {
  return this.views + (this.attendees * 10);
});

// Virtual for availability percentage
eventSchema.virtual('availabilityPercentage').get(function() {
  if (!this.capacity) return 100;
  return Math.max(0, ((this.capacity - this.attendees) / this.capacity) * 100);
});

// Instance method to increment views
eventSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({ 
    date: { $gte: new Date() },
    status: 'published'
  })
    .sort({ date: 1 })
    .limit(limit);
};

// Static method to find popular events
eventSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ views: -1 })
    .limit(limit);
};

// Static method to find featured events
eventSchema.statics.findFeatured = function(limit = 6) {
  return this.find({ 
    featured: true, 
    status: 'published' 
  })
    .sort({ views: -1 })
    .limit(limit);
};

// Static method to find events near a location
eventSchema.statics.findNearby = function(lat, lng, maxDistance = 10000, limit = 10) {
  return this.find({
    latitude: { $exists: true, $ne: null },
    longitude: { $exists: true, $ne: null },
    status: 'published'
  })
    .where('latitude').gte(lat - 0.1).lte(lat + 0.1)
    .where('longitude').gte(lng - 0.1).lte(lng + 0.1)
    .limit(limit);
};

// Pre-save middleware to auto-set priceCategory
eventSchema.pre('save', function(next) {
  if (this.isModified('price') && !this.isModified('priceCategory')) {
    if (this.price === 0) {
      this.priceCategory = 'free';
    } else if (this.price <= 500) {
      this.priceCategory = 'budget';
    } else if (this.price <= 2000) {
      this.priceCategory = 'moderate';
    } else {
      this.priceCategory = 'premium';
    }
  }
  
  // Auto-set imageUrl from first image if not provided
  if (this.images && this.images.length > 0 && !this.imageUrl) {
    this.imageUrl = this.images[0];
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema);