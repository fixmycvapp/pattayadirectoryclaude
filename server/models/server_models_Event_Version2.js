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
          // Allow past dates for historical events, but warn
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

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
  return this.capacity && this.attendees >= this.capacity;
});

// Virtual for popularity score (combination of views and attendees)
eventSchema.virtual('popularityScore').get(function() {
  return this.views + (this.attendees * 10);
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
  next();
});

module.exports = mongoose.model('Event', eventSchema);