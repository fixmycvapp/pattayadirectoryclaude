const User = require('../models/User');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// ============================================
// PROFILE CONTROLLERS
// ============================================

// @desc    Get current user profile with favorites and reminders
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        match: { status: 'published' }, // Only show published events
        select: '-__v',
      })
      .populate({
        path: 'notifications.eventId',
        match: { status: 'published' },
        select: '-__v',
      })
      .select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Filter out reminders with deleted events
    const activeReminders = user.notifications.filter(n => n.eventId);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      favorites: user.favorites || [],
      reminders: activeReminders.map(n => ({
        event: n.eventId,
        reminderDate: n.reminderDate,
        notified: n.notified,
      })),
      stats: {
        totalFavorites: user.favorites.length,
        totalReminders: activeReminders.length,
      },
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, image } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -__v');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Check if user has favorited/set reminder for event
// @route   GET /api/users/me/interactions/:eventId
// @access  Private
exports.getEventInteractions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isFavorite = user.favorites.some(
      id => id.toString() === req.params.eventId
    );

    const hasReminder = user.notifications.some(
      n => n.eventId && n.eventId.toString() === req.params.eventId
    );

    const reminderDetails = user.notifications.find(
      n => n.eventId && n.eventId.toString() === req.params.eventId
    );

    res.status(200).json({
      success: true,
      data: {
        isFavorite,
        hasReminder,
        reminderDate: reminderDetails?.reminderDate || null,
      },
    });
  } catch (error) {
    console.error('Error in getEventInteractions:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking interactions',
      error: error.message,
    });
  }
};

// ============================================
// FAVORITES CONTROLLERS
// ============================================

// @desc    Get all favorite events
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { status: 'published' },
      options: { sort: { date: 1 } }, // Sort by date ascending
      select: '-__v',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Error in getFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message,
    });
  }
};

// @desc    Add event to favorites
// @route   POST /api/users/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { eventId } = req.body;

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
        message: 'Cannot favorite unpublished events',
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already favorited
    if (user.favorites.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Event already in favorites',
      });
    }

    // Add to favorites
    await user.addFavorite(eventId);

    // Get updated user with populated favorites
    const updatedUser = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { status: 'published' },
      select: '-__v',
    });

    res.status(200).json({
      success: true,
      message: 'Event added to favorites',
      data: {
        eventId,
        totalFavorites: updatedUser.favorites.length,
      },
    });
  } catch (error) {
    console.error('Error in addFavorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message,
    });
  }
};

// @desc    Remove event from favorites
// @route   DELETE /api/users/favorites/:eventId
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user.id);

    // Check if event is in favorites
    if (!user.favorites.includes(req.params.eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Event not in favorites',
      });
    }

    await user.removeFavorite(req.params.eventId);

    res.status(200).json({
      success: true,
      message: 'Event removed from favorites',
      data: {
        eventId: req.params.eventId,
        totalFavorites: user.favorites.length,
      },
    });
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message,
    });
  }
};

// @desc    Check if event is favorited
// @route   GET /api/users/favorites/:eventId
// @access  Private
exports.checkFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user.id);

    const isFavorite = user.favorites.some(
      id => id.toString() === req.params.eventId
    );

    res.status(200).json({
      success: true,
      data: {
        eventId: req.params.eventId,
        isFavorite,
      },
    });
  } catch (error) {
    console.error('Error in checkFavorite:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking favorite status',
      error: error.message,
    });
  }
};

// @desc    Clear all favorites
// @route   DELETE /api/users/favorites
// @access  Private
exports.clearAllFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const previousCount = user.favorites.length;
    user.favorites = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'All favorites cleared',
      data: {
        clearedCount: previousCount,
      },
    });
  } catch (error) {
    console.error('Error in clearAllFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing favorites',
      error: error.message,
    });
  }
};

// ============================================
// REMINDERS CONTROLLERS
// ============================================

// @desc    Get all event reminders
// @route   GET /api/users/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'notifications.eventId',
      match: { status: 'published' },
      select: '-__v',
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Filter out reminders with deleted events and sort by reminder date
    const activeReminders = user.notifications
      .filter(n => n.eventId)
      .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate))
      .map(n => ({
        event: n.eventId,
        reminderDate: n.reminderDate,
        notified: n.notified,
      }));

    res.status(200).json({
      success: true,
      count: activeReminders.length,
      data: activeReminders,
    });
  } catch (error) {
    console.error('Error in getReminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message,
    });
  }
};

// @desc    Add event reminder
// @route   POST /api/users/reminders
// @access  Private
exports.addReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { eventId, reminderDate } = req.body;

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

    const user = await User.findById(req.user.id);

    // Check if reminder already exists
    const existingReminder = user.notifications.find(
      n => n.eventId && n.eventId.toString() === eventId
    );

    if (existingReminder) {
      return res.status(400).json({
        success: false,
        message: 'Reminder already set for this event',
      });
    }

    await user.addReminder(eventId, reminderDate);

    res.status(201).json({
      success: true,
      message: 'Reminder set successfully',
      data: {
        eventId,
        reminderDate,
        eventDate: event.date,
      },
    });
  } catch (error) {
    console.error('Error in addReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting reminder',
      error: error.message,
    });
  }
};

// @desc    Remove event reminder
// @route   DELETE /api/users/reminders/:eventId
// @access  Private
exports.removeReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user.id);

    // Check if reminder exists
    const reminderExists = user.notifications.some(
      n => n.eventId && n.eventId.toString() === req.params.eventId
    );

    if (!reminderExists) {
      return res.status(400).json({
        success: false,
        message: 'No reminder set for this event',
      });
    }

    user.notifications = user.notifications.filter(
      n => !n.eventId || n.eventId.toString() !== req.params.eventId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reminder removed successfully',
      data: {
        eventId: req.params.eventId,
      },
    });
  } catch (error) {
    console.error('Error in removeReminder:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing reminder',
      error: error.message,
    });
  }
};

// @desc    Update reminder date
// @route   PUT /api/users/reminders/:eventId
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

    const { reminderDate } = req.body;

    const user = await User.findById(req.user.id);

    const reminderIndex = user.notifications.findIndex(
      n => n.eventId && n.eventId.toString() === req.params.eventId
    );

    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'No reminder found for this event',
      });
    }

    // Validate new reminder date
    const event = await Event.findById(req.params.eventId);
    const reminder = new Date(reminderDate);
    const eventDate = new Date(event.date);

    if (reminder >= eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Reminder must be set before the event date',
      });
    }

    user.notifications[reminderIndex].reminderDate = reminderDate;
    user.notifications[reminderIndex].notified = false; // Reset notified status
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reminder updated successfully',
      data: {
        eventId: req.params.eventId,
        reminderDate,
      },
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
// STATISTICS CONTROLLERS
// ============================================

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        match: { status: 'published' },
      })
      .populate({
        path: 'notifications.eventId',
        match: { status: 'published' },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const activeReminders = user.notifications.filter(n => n.eventId);
    const upcomingEvents = user.favorites.filter(
      event => new Date(event.date) > new Date()
    );
    const pastEvents = user.favorites.filter(
      event => new Date(event.date) <= new Date()
    );

    // Event type distribution
    const typeDistribution = {};
    user.favorites.forEach(event => {
      typeDistribution[event.type] = (typeDistribution[event.type] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalFavorites: user.favorites.length,
        totalReminders: activeReminders.length,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length,
        memberSince: user.createdAt,
        typeDistribution,
      },
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message,
    });
  }
};