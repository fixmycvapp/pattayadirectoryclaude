const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Validation middleware
const validateEventId = [
  param('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
];

const validateFavoriteBody = [
  body('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format')
    .notEmpty()
    .withMessage('Event ID is required'),
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
      if (reminderDate <= new Date()) {
        throw new Error('Reminder date must be in the future');
      }
      return true;
    }),
];

// All routes require authentication
router.use(protect);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Check user interactions with an event
router.get('/me/interactions/:eventId', userController.getEventInteractions);
router.get('/me', userController.getCurrentUser);

router.put('/me', userController.updateProfile);

// Favorites
router.get('/favorites', userController.getFavorites);
router.get('/me/interactions/:eventId', validateEventId, userController.getEventInteractions);
router.post('/favorites', userController.addFavorite);
router.post('/favorites', validateFavoriteBody, userController.addFavorite);
router.delete('/favorites/:eventId', validateEventId, userController.removeFavorite);
router.delete('/favorites', userController.clearAllFavorites);
router.get(  '/favorites/:eventId', validateEventId, userController.checkFavorite);

// Reminders
router.get('/reminders', userController.getReminders);
router.post('/reminders', validateReminderBody, userController.addReminder);
router.delete('/reminders/:eventId', validateEventId,userController.removeReminder);

router.put('/reminders/:eventId', validateEventId, validateReminderBody, userController.updateReminder);

router.get('/stats', userController.getUserStats);

module.exports = router;