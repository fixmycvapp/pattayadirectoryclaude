const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const venueController = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);

// @desc    Get all venues (restaurants, bars, clubs)
// @route   GET /api/venues
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      location,
      priceRange,
      cuisine,
      features,
      featured,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { active: true };

    if (category) query.category = category;
    if (location) query['location.area'] = location;
    if (priceRange) query.priceRange = priceRange;
    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (featured) query.featured = featured === 'true';
    if (features) {
      const featuresList = features.split(',');
      query.features = { $all: featuresList };
    }

    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { 'rating.average': -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [venues, total] = await Promise.all([
      Venue.find(query)
        .sort(sortOption)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Venue.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: venues.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: venues,
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message,
    });
  }
});

// @desc    Get venue by ID or slug
// @route   GET /api/venues/:id
// @access  Public

// Protected routes (admin only)
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      active: true,
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    // Increment views
    venue.views += 1;
    await venue.save();

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venue',
      error: error.message,
    });
  }
});

// Admin routes
router.post('/', protect, authorize('admin'), venueController.createVenue, async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: venue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating venue',
      error: error.message,
    });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: venue,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating venue',
      error: error.message,
    });
  }
});

router.delete('/:id', protect, authorize('admin'), venueController.deleteVenue);

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting venue',
      error: error.message,
    });
  }
});

module.exports = router;