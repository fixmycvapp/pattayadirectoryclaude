const User = require('../models/User');
const Event = require('../models/Event');
const Reminder = require('../models/Reminder');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const { scheduleReminder, cancelReminder } = require('../services/reminderScheduler');

// ============================================
// GET REMINDERS
// ============================================

// @desc    Get all reminders for authenticated user
// @route   GET /api/reminders
// @access  Private
exports.getAllReminders = async (req, res) => {
  try {
    const { status, sortBy = 'reminderDate', order = 'asc' } = req.query;

    const query = { userId: req.user.id };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const reminders = await Reminder.find(query)
      .populate({
        path: 'eventId',
        select: 'title date location imageUrl type status',
      })
      .sort(sortOptions)
      .lean();

    // Filter out reminders with deleted events
    const activeReminders = reminders.filter(r => r.eventId);

    res.status(200).json({
      success: true,
      count: activeReminders.length,
      data: activeReminders,
    });
  } catch (error) {
    console.error('Error in getAllReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message,
    });
  }
};

// @desc    Get upcoming reminders (next 7 days)
// @route   GET /api/reminders/upcoming
// @access  Private
exports.getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const reminders = await Reminder.find({
      userId: req.user.id,
      reminderDate: {
        $gte: now,
        $lte: sevenDaysFromNow,
      },
      status: { $in: ['pending', 'snoozed'] },
    })
      .populate({
        path: 'eventId',
        select: 'title date location imageUrl type',
      })
      .sort({ reminderDate: 1 })
      .lean();

    const activeReminders = reminders.filter(r => r.eventId);

    res.status(200).json({
      success: true,
      count: activeReminders.length,
      data: activeReminders,
    });
  } catch (error) {
    console.error('Error in getUpcomingReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming reminders',
      error: error.message,
    });
  }
};

// @desc    Get reminder by ID
// @route   GET /api/reminders/:reminderId
// @access  Private
exports.getReminderById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const reminder = await Reminder.findOne({
      _id: req.params.reminderId,
      userId: req.user.id,
    }).populate('eventId');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    console.error('Error in getReminderById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminder',
      error: error.message,
    });
  }
};

// @desc    Get reminders for specific event
// @route   GET /api/reminders/event/:eventId
// @access  Private
exports.getEventReminders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const reminders = await Reminder.find({
      userId: req.user.id,
      eventId: req.params.eventId,
    })
      .populate('eventId')
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  } catch (error) {
    console.error('Error in getEventReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event reminders',
      error: error.message,
    });
  }
};

// ============================================
// CREATE REMINDERS
// ============================================

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { eventId, reminderDate, reminderType = 'email', customMessage } = req.body;

    // Check if event exists and is published
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot set reminder for unpublished events',
      });
    }

    // Validate reminder date is before event date
    const reminder = new Date(reminderDate);
    const eventDate = new Date(event.date);

    if (reminder >= eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Reminder must be set before the event date',
      });
    }

    // Check if reminder already exists
    const existingReminder = await Reminder.findOne({
      userId: req.user.id,
      eventId,
      status: { $in: ['pending', 'snoozed'] },
    });

    if (existingReminder) {
      return res.status(400).json({
        success: false,
        message: 'Active reminder already exists for this event',
      });
    }

    // Create reminder
    const newReminder = await Reminder.create({
      userId: req.user.id,
      eventId,
      reminderDate,
      reminderType,
      customMessage,
      status: 'pending',
    });

    // Schedule reminder notification
    await scheduleReminder(newReminder._id);

    // Populate event details
    const populatedReminder = await Reminder.findById(newReminder._id).populate('eventId');

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: populatedReminder,
    });
  } catch (error) {
    console.error('Error in createReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reminder',
      error: error.message,
    });
  }
};

// @desc    Create bulk reminders
// @route   POST /api/reminders/bulk
// @access  Private
exports.createBulkReminders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { eventIds, reminderDate, reminderType = 'email' } = req.body;

    // Validate all events exist and are published
    const events = await Event.find({
      _id: { $in: eventIds },
      status: 'published',
    });

    if (events.length !== eventIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some events not found or not published',
      });
    }

    const reminder = new Date(reminderDate);
    const createdReminders = [];
    const failedReminders = [];

    for (const event of events) {
      const eventDate = new Date(event.date);

      if (reminder >= eventDate) {
        failedReminders.push({
          eventId: event._id,
          reason: 'Reminder date must be before event date',
        });
        continue;
      }

      // Check for existing reminder
      const existing = await Reminder.findOne({
        userId: req.user.id,
        eventId: event._id,
        status: { $in: ['pending', 'snoozed'] },
      });

      if (existing) {
        failedReminders.push({
          eventId: event._id,
          reason: 'Reminder already exists',
        });
        continue;
      }

      const newReminder = await Reminder.create({
        userId: req.user.id,
        eventId: event._id,
        reminderDate,
        reminderType,
        status: 'pending',
      });

      await scheduleReminder(newReminder._id);
      createdReminders.push(newReminder);
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdReminders.length} reminders`,
      data: {
        created: createdReminders.length,
        failed: failedReminders.length,
        reminders: createdReminders,
        failures: failedReminders,
      },
    });
  } catch (error) {
    console.error('Error in createBulkReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bulk reminders',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE REMINDERS
// ============================================

// @desc    Update reminder
// @route   PUT /api/reminders/:reminderId
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { reminderDate, reminderType, customMessage } = req.body;

    const reminder = await Reminder.findOne({
      _id: req.params.reminderId,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    // Get event to validate date
    const event = await Event.findById(reminder.eventId);
    const newReminderDate = new Date(reminderDate);
    const eventDate = new Date(event.date);

    if (newReminderDate >= eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Reminder must be set before the event date',
      });
    }

    // Cancel old scheduled job
    await cancelReminder(reminder._id);

    // Update reminder
    reminder.reminderDate = reminderDate;
    if (reminderType) reminder.reminderType = reminderType;
    if (customMessage !== undefined) reminder.customMessage = customMessage;
    reminder.status = 'pending';
    reminder.notified = false;

    await reminder.save();

    // Schedule new reminder
    await scheduleReminder(reminder._id);

    const updatedReminder = await Reminder.findById(reminder._id).populate('eventId');

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: updatedReminder,
    });
  } catch (error) {
    console.error('Error in updateReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder',
      error: error.message,
    });
  }
};

// ============================================
// DELETE REMINDERS
// ============================================

// @desc    Delete reminder
// @route   DELETE /api/reminders/:reminderId
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const reminder = await Reminder.findOne({
      _id: req.params.reminderId,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    // Cancel scheduled job
    await cancelReminder(reminder._id);

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
      data: {
        reminderId: req.params.reminderId,
      },
    });
  } catch (error) {
    console.error('Error in deleteReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message,
    });
  }
};

// @desc    Delete reminder by event ID
// @route   DELETE /api/reminders/event/:eventId
// @access  Private
exports.deleteEventReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const reminders = await Reminder.find({
      userId: req.user.id,
      eventId: req.params.eventId,
    });

    if (reminders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reminders found for this event',
      });
    }

    // Cancel all scheduled jobs
    for (const reminder of reminders) {
      await cancelReminder(reminder._id);
    }

    const result = await Reminder.deleteMany({
      userId: req.user.id,
      eventId: req.params.eventId,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} reminder(s) deleted`,
      data: {
        deletedCount: result.deletedCount,
        eventId: req.params.eventId,
      },
    });
  } catch (error) {
    console.error('Error in deleteEventReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event reminders',
      error: error.message,
    });
  }
};

// @desc    Delete all reminders
// @route   DELETE /api/reminders
// @access  Private
exports.deleteAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });

    // Cancel all scheduled jobs
    for (const reminder of reminders) {
      await cancelReminder(reminder._id);
    }

    const result = await Reminder.deleteMany({ userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All reminders deleted',
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error('Error in deleteAllReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting all reminders',
      error: error.message,
    });
  }
};

// ============================================
// REMINDER STATUS MANAGEMENT
// ============================================

// @desc    Mark reminder as acknowledged
// @route   PATCH /api/reminders/:reminderId/acknowledge
// @access  Private
exports.acknowledgeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.reminderId,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    reminder.status = 'acknowledged';
    reminder.acknowledgedAt = new Date();
    await reminder.save();

    res.status(200).json({
      success: true,
      message: 'Reminder acknowledged',
      data: reminder,
    });
  } catch (error) {
    console.error('Error in acknowledgeReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error acknowledging reminder',
      error: error.message,
    });
  }
};

// @desc    Snooze reminder
// @route   PATCH /api/reminders/:reminderId/snooze
// @access  Private
exports.snoozeReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { snoozeMinutes } = req.body;

    const reminder = await Reminder.findOne({
      _id: req.params.reminderId,
      userId: req.user.id,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found',
      });
    }

    const newReminderDate = new Date();
    newReminderDate.setMinutes(newReminderDate.getMinutes() + snoozeMinutes);

    // Cancel current job
    await cancelReminder(reminder._id);

    // Update reminder
    reminder.reminderDate = newReminderDate;
    reminder.status = 'snoozed';
    reminder.snoozedUntil = newReminderDate;
    await reminder.save();

    // Schedule new reminder
    await scheduleReminder(reminder._id);

    res.status(200).json({
      success: true,
      message: `Reminder snoozed for ${snoozeMinutes} minutes`,
      data: reminder,
    });
  } catch (error) {
    console.error('Error in snoozeReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error snoozing reminder',
      error: error.message,
    });
  }
};

// ============================================
// PREFERENCES & STATISTICS
// ============================================

// @desc    Get reminder preferences
// @route   GET /api/reminders/settings/preferences
// @access  Private
exports.getReminderPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('reminderPreferences');

    res.status(200).json({
      success: true,
      data: user.reminderPreferences || {
        emailEnabled: true,
        pushEnabled: false,
        defaultReminderTime: 24, // hours before event
      },
    });
  } catch (error) {
    console.error('Error in getReminderPreferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message,
    });
  }
};

// @desc    Update reminder preferences
// @route   PUT /api/reminders/settings/preferences
// @access  Private
exports.updateReminderPreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { emailEnabled, pushEnabled, defaultReminderTime } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.reminderPreferences) {
      user.reminderPreferences = {};
    }

    if (emailEnabled !== undefined) user.reminderPreferences.emailEnabled = emailEnabled;
    if (pushEnabled !== undefined) user.reminderPreferences.pushEnabled = pushEnabled;
    if (defaultReminderTime !== undefined) user.reminderPreferences.defaultReminderTime = defaultReminderTime;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.reminderPreferences,
    });
  } catch (error) {
    console.error('Error in updateReminderPreferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message,
    });
  }
};

// @desc    Get reminder statistics
// @route   GET /api/reminders/stats/summary
// @access  Private
exports.getReminderStats = async (req, res) => {
  try {
    const totalReminders = await Reminder.countDocuments({ userId: req.user.id });
    const pendingReminders = await Reminder.countDocuments({ userId: req.user.id, status: 'pending' });
    const sentReminders = await Reminder.countDocuments({ userId: req.user.id, status: 'sent' });
    const acknowledgedReminders = await Reminder.countDocuments({ userId: req.user.id, status: 'acknowledged' });

    const upcomingReminders = await Reminder.countDocuments({
      userId: req.user.id,
      reminderDate: { $gte: new Date() },
      status: { $in: ['pending', 'snoozed'] },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalReminders,
        pending: pendingReminders,
        sent: sentReminders,
        acknowledged: acknowledgedReminders,
        upcoming: upcomingReminders,
      },
    });
  } catch (error) {
    console.error('Error in getReminderStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};