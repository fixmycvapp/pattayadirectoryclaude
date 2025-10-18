const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    address: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      enum: ['venue', 'district', 'landmark', 'beach', 'shopping', 'other'],
      default: 'venue'
    },
    image: {
      type: String
    },
    capacity: {
      type: Number,
      min: 0
    },
    facilities: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Index for geospatial queries
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ name: 'text' });

module.exports = mongoose.model('Location', locationSchema);