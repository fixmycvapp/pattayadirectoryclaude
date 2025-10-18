const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      unique: true,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['venue', 'district', 'landmark', 'other'],
      default: 'venue'
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index for geospatial queries
locationSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);