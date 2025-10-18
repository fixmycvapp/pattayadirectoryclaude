const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    reminderDate: {
      type: Date,
      required: [true, 'Reminder date is required'],
      index: true,
    },
    reminderType: {
      type: String,
      enum: ['email', 'push', 'both'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'cancelled', 'snoozed', 'acknowledged'],
      default: 'pending',
      index: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
    notifiedAt: {
      type: Date,
    },
    acknowledgedAt: {
      type: Date,
    },
    snoozedUntil: {
      type: Date,
    },
    customMessage: {
      type: String,
      maxlength: 500,
    },
    failureReason: {
      type: String,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
reminderSchema.index({ userId: 1, eventId: 1 });
reminderSchema.index({ userId: 1, status: 1 });
reminderSchema.index({ reminderDate: 1, status: 1 });

// Virtual for checking if reminder is overdue
reminderSchema.virtual('isOverdue').get(function() {
  return this.reminderDate < new Date() && this.status === 'pending';
});

// Method to mark as sent
reminderSchema.methods.markAsSent = async function() {
  this.status = 'sent';
  this.notified = true;
  this.notifiedAt = new Date();
  return await this.save();
};

// Method to mark as failed
reminderSchema.methods.markAsFailed = async function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  return await this.save();
};

// Static method to get pending reminders
reminderSchema.statics.getPendingReminders = function() {
  return this.find({
    status: { $in: ['pending', 'snoozed'] },
    reminderDate: { $lte: new Date() },
  })
    .populate('userId', 'name email reminderPreferences')
    .populate('eventId', 'title date location imageUrl');
};

module.exports = mongoose.model('Reminder', reminderSchema);