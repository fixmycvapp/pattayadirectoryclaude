const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Get all events with filters, sorting, and pagination
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res, next) => {
  try {
    const { 
      type, 
      location, 
      priceCategory, 
      search, 
      sort = 'date',
      page = 1,
      limit = 12,
      status = 'published'
    } = req.query;

    // Build query
    let query = { status };

    // Filter by event type
    if (type) {
      query.type = type.toLowerCase();
    }

    // Filter by location (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by price category
    if (priceCategory) {
      query.priceCategory = priceCategory;
    }

    // Text search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort option
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, attendees: -1 };
        break;
      case 'date':
        sortOption = { date: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { date: 1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const events = await Event.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(skip)
      .select('-__v');

    // Get total count for pagination
    const total = await Event.countDocuments(query);
    const pages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      pages,
      data: events
    });

  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).select('-__v');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error('Error in getEventById:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
exports.createEvent = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });

  } catch (error) {
    console.error('Error in updateEvent:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// @desc    Increment event views
// @route   POST /api/events/:id/view
// @access  Public
exports.incrementEventViews = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.incrementViews();

    res.status(200).json({
      success: true,
      data: { views: event.views }
    });

  } catch (error) {
    console.error('Error in incrementEventViews:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing views',
      error: error.message
    });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
exports.getFeaturedEvents = async (req, res, next) => {
  try {
    const events = await Event.findFeatured(6);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error in getFeaturedEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured events',
      error: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
exports.getUpcomingEvents = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const events = await Event.findUpcoming(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// @desc    Get popular events
// @route   GET /api/events/popular
// @access  Public
exports.getPopularEvents = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const events = await Event.findPopular(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error('Error in getPopularEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular events',
      error: error.message
    });
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/events/:id/feature
// @access  Private (Admin)
exports.toggleFeatured = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.featured = !event.featured;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${event.featured ? 'featured' : 'unfeatured'} successfully`,
      data: event
    });

  } catch (error) {
    console.error('Error in toggleFeatured:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling featured status',
      error: error.message
    });
  }
};