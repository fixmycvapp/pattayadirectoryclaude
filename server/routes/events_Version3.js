const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

// Validation rules
const eventValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5000 characters'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').isIn(['concert', 'festival', 'nightlife', 'sports', 'market', 'cultural', 'other']).withMessage('Invalid event type'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];

// Public routes - MUST come BEFORE parameterized routes
router.get('/featured', eventController.getFeaturedEvents);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/popular', eventController.getPopularEvents);
router.get('/nearby', eventController.getNearbyEvents);

// Public routes with parameters
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/view', eventController.incrementEventViews);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), eventValidation, eventController.createEvent);
router.put('/:id', protect, authorize('admin'), eventController.updateEvent);
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);
router.patch('/:id/feature', protect, authorize('admin'), eventController.toggleFeatured);

module.exports = router;