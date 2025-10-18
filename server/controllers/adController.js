const AdSlot = require('../models/AdSlot');
const { validationResult } = require('express-validator');

// ============================================
// PUBLIC ROUTES
// ============================================

// @desc    Get active ads for specific position
// @route   GET /api/ads/position/:position
// @access  Public
exports.getAdsByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    const { page, category, location } = req.query;

    const ads = await AdSlot.getActiveAds(position, {
      page,
      category,
      location,
    });

    // Randomly select one ad based on weight
    let selectedAd = null;
    if (ads.length > 0) {
      const totalWeight = ads.reduce((sum, ad) => sum + (ad.weight || 1), 0);
      let random = Math.random() * totalWeight;
      
      for (const ad of ads) {
        random -= ad.weight || 1;
        if (random <= 0) {
          selectedAd = ad;
          break;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: selectedAd,
    });
  } catch (error) {
    console.error('Error in getAdsByPosition:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ads',
      error: error.message,
    });
  }
};

// @desc    Record ad impression
// @route   POST /api/ads/:id/impression
// @access  Public
exports.recordImpression = async (req, res) => {
  try {
    const ad = await AdSlot.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.recordImpression();

    res.status(200).json({
      success: true,
      message: 'Impression recorded',
    });
  } catch (error) {
    console.error('Error in recordImpression:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording impression',
      error: error.message,
    });
  }
};

// @desc    Record ad click
// @route   POST /api/ads/:id/click
// @access  Public
exports.recordClick = async (req, res) => {
  try {
    const ad = await AdSlot.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    await ad.recordClick();

    res.status(200).json({
      success: true,
      message: 'Click recorded',
      targetUrl: ad.targetUrl,
    });
  } catch (error) {
    console.error('Error in recordClick:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording click',
      error: error.message,
    });
  }
};

// ============================================
// ADMIN ROUTES
// ============================================

// @desc    Get all ads
// @route   GET /api/ads
// @access  Private/Admin
exports.getAllAds = async (req, res) => {
  try {
    const {
      status,
      position,
      active,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (position) query.position = position;
    if (active !== undefined) query.active = active === 'true';

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [ads, total] = await Promise.all([
      AdSlot.find(query)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      AdSlot.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: ads.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: ads,
    });
  } catch (error) {
    console.error('Error in getAllAds:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ads',
      error: error.message,
    });
  }
};

// @desc    Get ad by ID
// @route   GET /api/ads/:id
// @access  Private/Admin
exports.getAdById = async (req, res) => {
  try {
    const ad = await AdSlot.findById(req.params.id)
      .populate('approvedBy', 'name email');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ad,
    });
  } catch (error) {
    console.error('Error in getAdById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ad',
      error: error.message,
    });
  }
};

// @desc    Create new ad
// @route   POST /api/ads
// @access  Private/Admin
exports.createAd = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const ad = await AdSlot.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: ad,
    });
  } catch (error) {
    console.error('Error in createAd:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating ad',
      error: error.message,
    });
  }
};

// @desc    Update ad
// @route   PUT /api/ads/:id
// @access  Private/Admin
exports.updateAd = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const ad = await AdSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ad updated successfully',
      data: ad,
    });
  } catch (error) {
    console.error('Error in updateAd:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating ad',
      error: error.message,
    });
  }
};

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private/Admin
exports.deleteAd = async (req, res) => {
  try {
    const ad = await AdSlot.findByIdAndDelete(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ad deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAd:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ad',
      error: error.message,
    });
  }
};

// @desc    Approve ad
// @route   PATCH /api/ads/:id/approve
// @access  Private/Admin
exports.approveAd = async (req, res) => {
  try {
    const ad = await AdSlot.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    ad.status = 'approved';
    ad.approvedBy = req.user.id;
    ad.approvedAt = new Date();
    
    // Auto-activate if within date range
    const now = new Date();
    if (ad.startDate <= now && ad.endDate >= now) {
      ad.status = 'active';
      ad.active = true;
    }

    await ad.save();

    res.status(200).json({
      success: true,
      message: 'Ad approved successfully',
      data: ad,
    });
  } catch (error) {
    console.error('Error in approveAd:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving ad',
      error: error.message,
    });
  }
};

// @desc    Reject ad
// @route   PATCH /api/ads/:id/reject
// @access  Private/Admin
exports.rejectAd = async (req, res) => {
  try {
    const { reason } = req.body;

    const ad = await AdSlot.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    ad.status = 'rejected';
    ad.rejectionReason = reason || 'No reason provided';
    ad.active = false;

    await ad.save();

    res.status(200).json({
      success: true,
      message: 'Ad rejected',
      data: ad,
    });
  } catch (error) {
    console.error('Error in rejectAd:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting ad',
      error: error.message,
    });
  }
};

// @desc    Get ad analytics
// @route   GET /api/ads/:id/analytics
// @access  Private/Admin
exports.getAdAnalytics = async (req, res) => {
  try {
    const ad = await AdSlot.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found',
      });
    }

    const ctr = ad.impressions > 0 
      ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
      : 0;

    const conversionRate = ad.clicks > 0
      ? ((ad.conversions / ad.clicks) * 100).toFixed(2)
      : 0;

    const daysActive = Math.ceil(
      (new Date() - ad.startDate) / (1000 * 60 * 60 * 24)
    );

    const avgImpressionsPerDay = daysActive > 0
      ? (ad.impressions / daysActive).toFixed(0)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        id: ad._id,
        title: ad.title,
        position: ad.position,
        impressions: ad.impressions,
        clicks: ad.clicks,
        conversions: ad.conversions,
        ctr: parseFloat(ctr),
        conversionRate: parseFloat(conversionRate),
        daysActive,
        avgImpressionsPerDay: parseInt(avgImpressionsPerDay),
        startDate: ad.startDate,
        endDate: ad.endDate,
        status: ad.status,
        active: ad.active,
      },
    });
  } catch (error) {
    console.error('Error in getAdAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};

// @desc    Get overall ad statistics
// @route   GET /api/ads/stats/overview
// @access  Private/Admin
exports.getAdStats = async (req, res) => {
  try {
    const [
      totalAds,
      activeAds,
      totalImpressions,
      totalClicks,
      adsByPosition,
      adsByStatus,
    ] = await Promise.all([
      AdSlot.countDocuments(),
      AdSlot.countDocuments({ active: true, status: 'active' }),
      AdSlot.aggregate([
        { $group: { _id: null, total: { $sum: '$impressions' } } },
      ]),
      AdSlot.aggregate([
        { $group: { _id: null, total: { $sum: '$clicks' } } },
      ]),
      AdSlot.aggregate([
        { $group: { _id: '$position', count: { $sum: 1 } } },
      ]),
      AdSlot.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const impressions = totalImpressions[0]?.total || 0;
    const clicks = totalClicks[0]?.total || 0;
    const overallCtr = impressions > 0
      ? ((clicks / impressions) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAds,
        activeAds,
        totalImpressions: impressions,
        totalClicks: clicks,
        overallCtr: parseFloat(overallCtr),
        byPosition: adsByPosition,
        byStatus: adsByStatus,
      },
    });
  } catch (error) {
    console.error('Error in getAdStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};