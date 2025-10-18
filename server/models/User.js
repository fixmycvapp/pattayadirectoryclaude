const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },

  reminderPreferences: {
  emailEnabled: {
    type: Boolean,
    default: true,
  },
  pushEnabled: {
    type: Boolean,
    default: false,
  },
  defaultReminderTime: {
    type: Number, // hours before event
    default: 24,
    min: 1,
    max: 168, // 1 week
  },
},

    // User Interactions
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }],
        notifications: [{
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      },
      reminderDate: {
        type: Date
      },
      notified: {
        type: Boolean,
        default: false
      }
    }],
  // OAuth providers
    googleId: {
      type: String,
      sparse: true,
    },
    
    emailVerified: {
      type: Boolean,
      default: false
    },
    
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Method to add favorite event
userSchema.methods.addFavorite = async function(eventId) {
  if (!this.favorites.includes(eventId)) {
    this.favorites.push(eventId);
    await this.save();
  }
  return this.favorites;
};

// Method to remove favorite event
userSchema.methods.removeFavorite = async function(eventId) {
  this.favorites = this.favorites.filter(
    id => id.toString() !== eventId.toString()
  );
  await this.save();
  return this.favorites;
};

// Method to add event reminder
userSchema.methods.addReminder = async function(eventId, reminderDate) {
  const existingReminder = this.notifications.find(
    n => n.eventId.toString() === eventId.toString()
  );

   
  if (!existingReminder) {
    this.notifications.push({
      eventId,
      reminderDate,
      notified: false
    });
    await this.save();
  }
  
  return this.notifications;
};
module.exports = mongoose.model('User', userSchema);