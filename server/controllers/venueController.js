const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getAllVenues = async (req, res) => {
  try {
    const { type, search, sort = 'rating', limit = 50 } = req.query;

    let query = { status: 'active' };

    if (type && type !== 'all') {
      query.type = type.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    switch (sort) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { rating: -1 };
    }

    const venues = await Venue.find(query)
      .sort(sortOption)
      .limit(parseInt(limit, 10))
      .select('-__v')
      .lean();

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    console.error('Error in getAllVenues:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venues',
      error: error.message,
    });
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).select('-__v').lean();

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error('Error in getVenueById:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Venue not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching venue',
      error: error.message,
    });
  }
};

// @desc    Create venue
// @route   POST /api/venues
// @access  Private (Admin)
exports.createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: venue,
    });
  } catch (error) {
    console.error('Error in createVenue:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating venue',
      error: error.message,
    });
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private (Admin)
exports.updateVenue = async (req, res) => {
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
    console.error('Error in updateVenue:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating venue',
      error: error.message,
    });
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private (Admin)
exports.deleteVenue = async (req, res) => {
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
    console.error('Error in deleteVenue:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting venue',
      error: error.message,
    });
  }
};