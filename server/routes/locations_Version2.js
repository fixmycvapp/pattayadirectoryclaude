const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), locationController.createLocation);
router.put('/:id', protect, authorize('admin'), locationController.updateLocation);
router.delete('/:id', protect, authorize('admin'), locationController.deleteLocation);

module.exports = router;