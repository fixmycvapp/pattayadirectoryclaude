const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required']
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['concert', 'festival', 'nightlife', 'sports', 'market', 'cultural', 'other'],
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
      enum: ['free', 'budget', 'moderate', 'premium'],
      default: 'free'
    },
    images: {
      type: [String],
      default: []
    },
    organizer: {
      type: String,
      trim: true
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
      enum: ['draft', 'published', 'cancelled'],
      default: 'published'
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
eventSchema.index({ title: 'text', description: 'text' });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Method to increment views
eventSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
  return this.find({ 
    date: { $gte: new Date() },
    status: 'published'
  }).sort({ date: 1 });
};

// Static method to find popular events
eventSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ views: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Event', eventSchema);