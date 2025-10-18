const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);

// Protected routes (admin only)
router.post('/', auth, locationController.createLocation);
router.put('/:id', auth, locationController.updateLocation);
router.delete('/:id', auth, locationController.deleteLocation);

module.exports = router;