const Queue = require('bull');
const emailService = require('./emailService');
const Reminder = require('../models/Reminder');

// Create email queue
const emailQueue = new Queue('email-notifications', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/**
 * Process email jobs
 */
emailQueue.process('send-reminder', async (job) => {
  const { reminderId, userId, eventId, type } = job.data;

  try {
    const reminder = await Reminder.findById(reminderId)
      .populate('userId', 'name email reminderPreferences')
      .populate('eventId', 'title date location imageUrl description price type');

    if (!reminder) {
      throw new Error(`Reminder ${reminderId} not found`);
    }

    if (!reminder.eventId) {
      throw new Error('Event has been deleted');
    }

    // Send email
    await emailService.sendEventReminder({
      to: reminder.userId.email,
      userName: reminder.userId.name,
      event: reminder.eventId,
      customMessage: reminder.customMessage,
      reminderType: type || 'standard',
    });

    // Mark as sent
    await reminder.markAsSent();

    return { success: true, reminderId };

  } catch (error) {
    console.error(`❌ Failed to send reminder ${reminderId}:`, error);
    
    // Mark as failed
    if (reminderId) {
      const reminder = await Reminder.findById(reminderId);
      if (reminder) {
        await reminder.markAsFailed(error.message);
      }
    }

    throw error;
  }
});

emailQueue.process('send-digest', async (job) => {
  const { userId, reminders } = job.data;

  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await emailService.sendReminderDigest({
      to: user.email,
      userName: user.name,
      reminders,
    });

    return { success: true, userId };

  } catch (error) {
    console.error(`❌ Failed to send digest to ${userId}:`, error);
    throw error;
  }
});

emailQueue.process('send-confirmation', async (job) => {
  const { userId, eventId, reminderDate } = job.data;

  try {
    const User = require('../models/User');
    const Event = require('../models/Event');

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      throw new Error('User or event not found');
    }

    await emailService.sendReminderConfirmation({
      to: user.email,
      userName: user.name,
      event,
      reminderDate,
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send confirmation:', error);
    throw error;
  }
});

emailQueue.process('send-cancellation', async (job) => {
  const { userId, eventId, reason } = job.data;

  try {
    const User = require('../models/User');
    const Event = require('../models/Event');

    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      throw new Error('User or event not found');
    }

    await emailService.sendEventCancellation({
      to: user.email,
      userName: user.name,
      event,
      reason,
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send cancellation:', error);
    throw error;
  }
});

emailQueue.process('send-welcome', async (job) => {
  const { userId } = job.data;

  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await emailService.sendWelcomeEmail({
      to: user.email,
      userName: user.name,
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
});

/**
 * Event handlers
 */
emailQueue.on('completed', (job, result) => {
  console.log(`✅ Email job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, error) => {
  console.error(`❌ Email job ${job.id} failed:`, error.message);
});

emailQueue.on('stalled', (job) => {
  console.warn(`⚠️ Email job ${job.id} stalled`);
});

/**
 * Add email to queue
 */
const addToQueue = {
  sendReminder: (reminderId, options = {}) => {
    return emailQueue.add('send-reminder', { reminderId, ...options }, {
      delay: options.delay || 0,
      priority: options.priority || 5,
    });
  },

  sendDigest: (userId, reminders, options = {}) => {
    return emailQueue.add('send-digest', { userId, reminders }, {
      delay: options.delay || 0,
    });
  },

  sendConfirmation: (userId, eventId, reminderDate, options = {}) => {
    return emailQueue.add('send-confirmation', { userId, eventId, reminderDate }, {
      delay: options.delay || 0,
    });
  },

  sendCancellation: (userId, eventId, reason, options = {}) => {
    return emailQueue.add('send-cancellation', { userId, eventId, reason }, {
      priority: 1, // High priority
    });
  },

  sendWelcome: (userId, options = {}) => {
    return emailQueue.add('send-welcome', { userId }, {
      delay: options.delay || 5000, // 5 second delay
    });
  },
};

/**
 * Get queue statistics
 */
const getQueueStats = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    emailQueue.getWaitingCount(),
    emailQueue.getActiveCount(),
    emailQueue.getCompletedCount(),
    emailQueue.getFailedCount(),
    emailQueue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
};

/**
 * Clean old jobs
 */
const cleanOldJobs = async () => {
  const oneDayAgo = 24 * 60 * 60 * 1000;
  
  await emailQueue.clean(oneDayAgo, 'completed');
  await emailQueue.clean(oneDayAgo * 7, 'failed'); // Keep failed jobs for 7 days
  
  console.log('✅ Old email jobs cleaned');
};

module.exports = {
  emailQueue,
  addToQueue,
  getQueueStats,
  cleanOldJobs,
};