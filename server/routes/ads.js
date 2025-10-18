const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adController = require('../controllers/adController');
const { protect, authorize } = require('../middleware/auth');

// Validation
const validateAd = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('position')
    .isIn(['header', 'sidebar', 'footer', 'inline', 'popup', 'event-detail'])
    .withMessage('Invalid position'),
  body('type')
    .isIn(['image', 'html', 'video', 'carousel'])
    .withMessage('Invalid ad type'),
  body('startDate')
    .isISO8601()
    .withMessage('Invalid start date'),
  body('endDate')
    .isISO8601()
    .withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('advertiser.name')
    .trim()
    .notEmpty()
    .withMessage('Advertiser name is required'),
  body('advertiser.email')
    .isEmail()
    .withMessage('Valid email is required'),
];

// ============================================
// PUBLIC ROUTES
// ============================================

// Get ads by position
router.get('/position/:position', adController.getAdsByPosition);

// Record impression
router.post('/:id/impression', adController.recordImpression);

// Record click
router.post('/:id/click', adController.recordClick);

// ============================================
// ADMIN ROUTES
// ============================================

// Protect all routes below
router.use(protect);
router.use(authorize('admin'));

// Get all ads
router.get('/', adController.getAllAds);

// Get ad statistics
router.get('/stats/overview', adController.getAdStats);

// Get ad by ID
router.get('/:id', adController.getAdById);

// Get ad analytics
router.get('/:id/analytics', adController.getAdAnalytics);

// Create ad
router.post('/', validateAd, adController.createAd);

// Update ad
router.put('/:id', validateAd, adController.updateAd);

// Delete ad
router.delete('/:id', adController.deleteAd);

// Approve ad
router.patch('/:id/approve', adController.approveAd);

// Reject ad
router.patch('/:id/reject', [
  body('reason').optional().trim(),
], adController.rejectAd);

module.exports = router;