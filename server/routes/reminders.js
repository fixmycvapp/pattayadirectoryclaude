const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const reminderController = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

// Validation middleware
const validateEventId = [
  param('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
];

const validateReminderId = [
  param('reminderId')
    .isMongoId()
    .withMessage('Invalid reminder ID format'),
];

const validateReminderBody = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format')
    .notEmpty()
    .withMessage('Event ID is required'),
  body('reminderDate')
    .isISO8601()
    .withMessage('Invalid reminder date format')
    .notEmpty()
    .withMessage('Reminder date is required')
    .custom((value) => {
      const reminderDate = new Date(value);
      const now = new Date();
      if (reminderDate <= now) {
        throw new Error('Reminder date must be in the future');
      }
      return true;
    }),
  body('reminderType')
    .optional()
    .isIn(['email', 'push', 'both'])
    .withMessage('Invalid reminder type'),
  body('customMessage')
    .optional()
    .isString()
    .withMessage('Custom message must be a string')
    .isLength({ max: 500 })
    .withMessage('Custom message cannot exceed 500 characters'),
];

const validateBulkReminders = [
  body('eventIds')
    .isArray({ min: 1 })
    .withMessage('eventIds must be a non-empty array'),
  body('eventIds.*')
    .isMongoId()
    .withMessage('Each eventId must be a valid MongoDB ID'),
  body('reminderDate')
    .isISO8601()
    .withMessage('Invalid reminder date format'),
];

// ============================================
// AUTHENTICATION REQUIRED FOR ALL ROUTES
// ============================================
router.use(protect);

// ============================================
// REMINDER MANAGEMENT ROUTES
// ============================================

// @desc    Get all reminders for authenticated user
// @route   GET /api/reminders
// @access  Private
router.get('/', reminderController.getAllReminders);

// @desc    Get upcoming reminders (next 7 days)
// @route   GET /api/reminders/upcoming
// @access  Private
router.get('/upcoming', reminderController.getUpcomingReminders);

// @desc    Get reminder by ID
// @route   GET /api/reminders/:reminderId
// @access  Private
router.get('/:reminderId', validateReminderId, reminderController.getReminderById);

// @desc    Get reminders for specific event
// @route   GET /api/reminders/event/:eventId
// @access  Private
router.get('/event/:eventId', validateEventId, reminderController.getEventReminders);

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
router.post('/', validateReminderBody, reminderController.createReminder);

// @desc    Create bulk reminders
// @route   POST /api/reminders/bulk
// @access  Private
router.post('/bulk', validateBulkReminders, reminderController.createBulkReminders);

// @desc    Update reminder
// @route   PUT /api/reminders/:reminderId
// @access  Private
router.put('/:reminderId', validateReminderId, validateReminderBody, reminderController.updateReminder);

// @desc    Delete reminder
// @route   DELETE /api/reminders/:reminderId
// @access  Private
router.delete('/:reminderId', validateReminderId, reminderController.deleteReminder);

// @desc    Delete reminder by event ID
// @route   DELETE /api/reminders/event/:eventId
// @access  Private
router.delete('/event/:eventId', validateEventId, reminderController.deleteEventReminder);

// @desc    Delete all reminders
// @route   DELETE /api/reminders
// @access  Private
router.delete('/', reminderController.deleteAllReminders);

// ============================================
// REMINDER STATUS ROUTES
// ============================================

// @desc    Mark reminder as read/acknowledged
// @route   PATCH /api/reminders/:reminderId/acknowledge
// @access  Private
router.patch('/:reminderId/acknowledge', validateReminderId, reminderController.acknowledgeReminder);

// @desc    Snooze reminder
// @route   PATCH /api/reminders/:reminderId/snooze
// @access  Private
router.patch('/:reminderId/snooze', validateReminderId, [
  body('snoozeMinutes')
    .isInt({ min: 5, max: 1440 })
    .withMessage('Snooze time must be between 5 and 1440 minutes (24 hours)'),
], reminderController.snoozeReminder);

// ============================================
// REMINDER PREFERENCES ROUTES
// ============================================

// @desc    Get reminder preferences
// @route   GET /api/reminders/preferences
// @access  Private
router.get('/settings/preferences', reminderController.getReminderPreferences);

// @desc    Update reminder preferences
// @route   PUT /api/reminders/preferences
// @access  Private
router.put('/settings/preferences', [
  body('emailEnabled')
    .optional()
    .isBoolean()
    .withMessage('emailEnabled must be a boolean'),
  body('pushEnabled')
    .optional()
    .isBoolean()
    .withMessage('pushEnabled must be a boolean'),
  body('defaultReminderTime')
    .optional()
    .isInt({ min: 1, max: 168 })
    .withMessage('defaultReminderTime must be between 1 and 168 hours'),
], reminderController.updateReminderPreferences);

// ============================================
// STATISTICS ROUTES
// ============================================

// @desc    Get reminder statistics
// @route   GET /api/reminders/stats
// @access  Private
router.get('/stats/summary', reminderController.getReminderStats);

module.exports = router;