const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Get all events with filters, sorting, and pagination (UPDATED FOR INFINITE SCROLL)
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
      limit = 12,
      offset = 0,
      status = 'published',
      featured,
      lat,
      lng,
      radius = 10
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

    // Filter by featured status
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Text search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Nearby events search (if lat/lng provided)
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);
      
      const latDelta = radiusNum / 111;
      const lngDelta = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
      
      query.latitude = { $gte: latNum - latDelta, $lte: latNum + latDelta };
      query.longitude = { $gte: lngNum - lngDelta, $lte: lngNum + lngDelta };
    }

    // Build sort option
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1, attendees: -1 };
        break;
      case 'date':
        // Sort by date - upcoming events first, then past events
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

    // Convert limit and offset to integers
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    // Execute query with limit and offset
    const events = await Event.find(query)
      .sort(sortOption)
      .limit(limitNum)
      .skip(offsetNum)
      .select('-__v')
      .lean();

    // Get total count for hasMore calculation
    const total = await Event.countDocuments(query);
    
    // Calculate if there are more events to load
    const hasMore = offsetNum + events.length < total;

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      offset: offsetNum,
      limit: limitNum,
      hasMore,
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

// ... rest of the controller methods remain the same