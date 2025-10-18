const schedule = require('node-schedule');
const Reminder = require('../models/Reminder');
const { addToQueue } = require('./emailQueue');

// Store active jobs
const activeJobs = new Map();

/**
 * Schedule a reminder notification
 */
exports.scheduleReminder = async (reminderId) => {
  try {
    const reminder = await Reminder.findById(reminderId)
      .populate('userId', 'name email reminderPreferences')
      .populate('eventId', 'title date location imageUrl description');

    if (!reminder) {
      console.error(`Reminder ${reminderId} not found`);
      return;
    }

    // Cancel existing job if any
    if (activeJobs.has(reminderId.toString())) {
      activeJobs.get(reminderId.toString()).cancel();
    }

    const reminderDate = new Date(reminder.reminderDate);
    const now = new Date();

    // Calculate delay based on how far in the future
    const delayMs = reminderDate - now;

    // If reminder date is in the past, send immediately
    if (delayMs <= 0) {
      await addToQueue.sendReminder(reminderId, { priority: 1 });
      console.log(`⚡ Immediate reminder queued: ${reminderId}`);
      return;
    }

    // If less than 5 minutes away, queue with delay
    if (delayMs < 5 * 60 * 1000) {
      await addToQueue.sendReminder(reminderId, { 
        delay: delayMs,
        priority: 2,
      });
      console.log(`⏰ Reminder queued with delay: ${reminderId}`);
      return;
    }

    // For future reminders, schedule with node-schedule
    const job = schedule.scheduleJob(reminderDate, async () => {
      await addToQueue.sendReminder(reminderId, { priority: 3 });
      activeJobs.delete(reminderId.toString());
      console.log(`📧 Reminder sent to queue: ${reminderId}`);
    });

    activeJobs.set(reminderId.toString(), job);
    console.log(`✅ Reminder scheduled for ${reminderDate}: ${reminderId}`);

  } catch (error) {
    console.error(`Error scheduling reminder ${reminderId}:`, error);
  }
};

/**
 * Cancel a scheduled reminder
 */
exports.cancelReminder = async (reminderId) => {
  const reminderIdStr = reminderId.toString();
  
  if (activeJobs.has(reminderIdStr)) {
    activeJobs.get(reminderIdStr).cancel();
    activeJobs.delete(reminderIdStr);
    console.log(`❌ Reminder cancelled: ${reminderId}`);
  }
};

/**
 * Initialize scheduler - load all pending reminders
 */
exports.initializeScheduler = async () => {
  try {
    console.log('🚀 Initializing reminder scheduler...');

    const pendingReminders = await Reminder.find({
      status: { $in: ['pending', 'snoozed'] },
      reminderDate: { $gte: new Date() },
    });

    for (const reminder of pendingReminders) {
      await exports.scheduleReminder(reminder._id);
    }

    console.log(`✅ Scheduled ${pendingReminders.length} pending reminders`);

    // Schedule periodic processing of overdue reminders
    schedule.scheduleJob('*/10 * * * *', exports.processOverdueReminders);
    console.log('✅ Overdue reminder processor scheduled (every 10 minutes)');

  } catch (error) {
    console.error('Error initializing scheduler:', error);
  }
};

/**
 * Process overdue reminders
 */
exports.processOverdueReminders = async () => {
  try {
    const overdueReminders = await Reminder.find({
      status: 'pending',
      reminderDate: { $lt: new Date() },
    }).limit(50); // Process in batches

    if (overdueReminders.length > 0) {
      console.log(`⚠️ Processing ${overdueReminders.length} overdue reminders...`);
      
      for (const reminder of overdueReminders) {
        await addToQueue.sendReminder(reminder._id, { priority: 1 });
      }
    }

  } catch (error) {
    console.error('Error processing overdue reminders:', error);
  }
};

/**
 * Send daily digest to users
 */
exports.sendDailyDigests = async () => {
  try {
    console.log('📧 Sending daily digests...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextDay = new Date(tomorrow);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all reminders for tomorrow, grouped by user
    const reminders = await Reminder.find({
      reminderDate: {
        $gte: tomorrow,
        $lt: nextDay,
      },
      status: 'pending',
    })
      .populate('userId', 'name email')
      .populate('eventId', 'title date location imageUrl');

    // Group by user
    const remindersByUser = {};
    reminders.forEach(reminder => {
      const userId = reminder.userId._id.toString();
      if (!remindersByUser[userId]) {
        remindersByUser[userId] = [];
      }
      remindersByUser[userId].push(reminder);
    });

    // Send digest to each user
    for (const [userId, userReminders] of Object.entries(remindersByUser)) {
      if (userReminders.length > 1) {
        await addToQueue.sendDigest(userId, userReminders);
      }
    }

    console.log(`✅ Daily digests queued for ${Object.keys(remindersByUser).length} users`);

  } catch (error) {
    console.error('Error sending daily digests:', error);
  }
};

// Schedule daily digest at 8 AM
schedule.scheduleJob('0 8 * * *', exports.sendDailyDigests);