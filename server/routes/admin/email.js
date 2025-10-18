const express = require('express');
const router = express.Router();
const emailService = require('../../services/emailService');
const { emailQueue, getQueueStats, cleanOldJobs } = require('../../services/emailQueue');
const { protect, authorize } = require('../../middleware/auth');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @desc    Test email connection
// @route   GET /api/admin/email/test-connection
// @access  Private/Admin
router.get('/test-connection', async (req, res) => {
  try {
    const result = await emailService.testConnection();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email connection test failed',
      error: error.message,
    });
  }
});

// @desc    Send test email
// @route   POST /api/admin/email/test-send
// @access  Private/Admin
router.post('/test-send', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address required',
      });
    }

    const result = await emailService.sendTestEmail(to);
    
    res.status(200).json({
      success: true,
      message: 'Test email sent',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
    });
  }
});

// @desc    Get email queue statistics
// @route   GET /api/admin/email/queue-stats
// @access  Private/Admin
router.get('/queue-stats', async (req, res) => {
  try {
    const stats = await getQueueStats();
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get queue stats',
      error: error.message,
    });
  }
});

// @desc    Get failed email jobs
// @route   GET /api/admin/email/failed-jobs
// @access  Private/Admin
router.get('/failed-jobs', async (req, res) => {
  try {
    const failed = await emailQueue.getFailed();
    
    res.status(200).json({
      success: true,
      count: failed.length,
      data: failed.map(job => ({
        id: job.id,
        data: job.data,
        failedReason: job.failedReason,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get failed jobs',
      error: error.message,
    });
  }
});

// @desc    Retry failed email job
// @route   POST /api/admin/email/retry/:jobId
// @access  Private/Admin
router.post('/retry/:jobId', async (req, res) => {
  try {
    const job = await emailQueue.getJob(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    await job.retry();
    
    res.status(200).json({
      success: true,
      message: 'Job queued for retry',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retry job',
      error: error.message,
    });
  }
});

// @desc    Clean old email jobs
// @route   POST /api/admin/email/clean
// @access  Private/Admin
router.post('/clean', async (req, res) => {
  try {
    await cleanOldJobs();
    
    res.status(200).json({
      success: true,
      message: 'Old jobs cleaned successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clean old jobs',
      error: error.message,
    });
  }
});

module.exports = router;