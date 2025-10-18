const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (admin only)
router.post('/', auth, eventController.createEvent);
// Public submission route (no auth required)
router.post('/submit', eventValidation, eventController.submitEvent);
router.put('/:id', auth, eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

// Special routes
router.post('/:id/view', eventController.incrementEventViews);
router.get('/featured/list', eventController.getFeaturedEvents);
router.get('/upcoming/list', eventController.getUpcomingEvents);

module.exports = router;