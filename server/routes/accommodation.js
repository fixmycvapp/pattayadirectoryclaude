const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all accommodations
// @route   GET /api/accommodation
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      location,
      type,
      priceCategory,
      minPrice,
      maxPrice,
      amenities,
      featured,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { active: true };

    if (location) query['location.area'] = location;
    if (type) query.type = type;
    if (priceCategory) query['priceRange.priceCategory'] = priceCategory;
    if (minPrice) query['priceRange.min'] = { $gte: parseInt(minPrice) };
    if (maxPrice) query['priceRange.max'] = { $lte: parseInt(maxPrice) };
    if (featured) query.featured = featured === 'true';
    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'price-low':
        sortOption = { 'priceRange.min': 1 };
        break;
      case 'price-high':
        sortOption = { 'priceRange.max': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { 'rating.average': -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [accommodations, total] = await Promise.all([
      Accommodation.find(query)
        .sort(sortOption)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Accommodation.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: accommodations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: accommodations,
    });
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodations',
      error: error.message,
    });
  }
});

// @desc    Get accommodation by ID or slug
// @route   GET /api/accommodation/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      active: true,
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found',
      });
    }

    // Increment views
    accommodation.views += 1;
    await accommodation.save();

    res.status(200).json({
      success: true,
      data: accommodation,
    });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodation',
      error: error.message,
    });
  }
});

// @desc    Get nearby accommodations
// @route   GET /api/accommodation/:id/nearby
// @access  Public
router.get('/:id/nearby', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found',
      });
    }

    const nearby = await Accommodation.findNearby(
      accommodation.location.latitude,
      accommodation.location.longitude,
      5
    ).limit(6);

    // Exclude current accommodation
    const filtered = nearby.filter(
      item => item._id.toString() !== accommodation._id.toString()
    );

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching nearby accommodations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby accommodations',
      error: error.message,
    });
  }
});

// @desc    Create accommodation
// @route   POST /api/accommodation
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully',
      data: accommodation,
    });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating accommodation',
      error: error.message,
    });
  }
});

// @desc    Update accommodation
// @route   PUT /api/accommodation/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Accommodation updated successfully',
      data: accommodation,
    });
  } catch (error) {
    console.error('Error updating accommodation:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating accommodation',
      error: error.message,
    });
  }
});

// @desc    Delete accommodation
// @route   DELETE /api/accommodation/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Accommodation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting accommodation',
      error: error.message,
    });
  }
});

module.exports = router;