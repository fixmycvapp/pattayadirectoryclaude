const cron = require('node-cron');
const eventbriteService = require('../services/eventbrite');
const facebookEventsService = require('../services/facebookEvents');

/**
 * Sync events from Eventbrite
 */
async function syncEventbrite() {
  try {
    console.log('\n🎟️  Syncing Eventbrite events...');

    // Search for events in Pattaya
    const searchResults = await eventbriteService.searchEvents({
      location: 'Pattaya, Thailand',
      radius: '50km',
      startDate: new Date().toISOString(),
    });

    if (searchResults.events && searchResults.events.length > 0) {
      console.log(`   Found ${searchResults.events.length} events from Eventbrite`);

      const results = await eventbriteService.syncEvents(searchResults.events);

      console.log(`   ✅ Created: ${results.created}`);
      console.log(`   🔄 Updated: ${results.updated}`);
      console.log(`   ⏭️  Skipped: ${results.skipped}`);
      
      if (results.errors.length > 0) {
        console.log(`   ❌ Errors: ${results.errors.length}`);
      }

      return results;
    } else {
      console.log('   ℹ️  No Eventbrite events found');
      return { created: 0, updated: 0, skipped: 0, errors: [] };
    }
  } catch (error) {
    console.error('❌ Eventbrite sync failed:', error.message);
    return { created: 0, updated: 0, skipped: 0, errors: [{ error: error.message }] };
  }
}

/**
 * Sync events from Facebook
 */
async function syncFacebook() {
  try {
    console.log('\n📘 Syncing Facebook events...');

    // Get events from configured page
    const pageEvents = await facebookEventsService.getPageEvents();

    // Also search for events near Pattaya
    const searchEvents = await facebookEventsService.searchEvents({
      latitude: 12.9236,
      longitude: 100.8825,
      distance: 50000,
    });

    // Combine and deduplicate
    const allEvents = [...pageEvents];
    const existingIds = new Set(pageEvents.map(e => e.id));

    for (const event of searchEvents) {
      if (!existingIds.has(event.id)) {
        allEvents.push(event);
        existingIds.add(event.id);
      }
    }

    if (allEvents.length > 0) {
      console.log(`   Found ${allEvents.length} events from Facebook`);

      const results = await facebookEventsService.syncEvents(allEvents);

      console.log(`   ✅ Created: ${results.created}`);
      console.log(`   🔄 Updated: ${results.updated}`);
      console.log(`   ⏭️  Skipped: ${results.skipped}`);
      
      if (results.errors.length > 0) {
        console.log(`   ❌ Errors: ${results.errors.length}`);
      }

      return results;
    } else {
      console.log('   ℹ️  No Facebook events found');
      return { created: 0, updated: 0, skipped: 0, errors: [] };
    }
  } catch (error) {
    console.error('❌ Facebook sync failed:', error.message);
    return { created: 0, updated: 0, skipped: 0, errors: [{ error: error.message }] };
  }
}

/**
 * Main sync function
 */
async function syncAllLiveEvents() {
  console.log('\n🔄 Starting live events sync...');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

  const results = {
    eventbrite: { created: 0, updated: 0, skipped: 0, errors: [] },
    facebook: { created: 0, updated: 0, skipped: 0, errors: [] },
  };

  // Sync Eventbrite
  if (process.env.EVENTBRITE_API_KEY) {
    results.eventbrite = await syncEventbrite();
  } else {
    console.log('\n⚠️  Eventbrite API key not configured');
  }

  // Wait 5 seconds between services
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Sync Facebook
  if (process.env.FACEBOOK_ACCESS_TOKEN) {
    results.facebook = await syncFacebook();
  } else {
    console.log('\n⚠️  Facebook access token not configured');
  }

  // Summary
  console.log('\n📊 Sync Summary:');
  console.log(`   Total created: ${results.eventbrite.created + results.facebook.created}`);
  console.log(`   Total updated: ${results.eventbrite.updated + results.facebook.updated}`);
  console.log(`   Total errors: ${results.eventbrite.errors.length + results.facebook.errors.length}`);
  console.log(`   Next run: ${getNextRunTime()}\n`);

  return results;
}

/**
 * Get next scheduled run time
 */
function getNextRunTime() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(next.getHours() + 4);
  return next.toLocaleString();
}

/**
 * Schedule the cron job
 */
function scheduleLiveEventsSync() {
  // Run every 4 hours: 0 */4 * * *
  // For testing: */10 * * * * (every 10 minutes)
  
  cron.schedule('0 */4 * * *', async () => {
    console.log('\n🤖 Cron job triggered: Syncing live events...');
    await syncAllLiveEvents();
  });

  console.log('✅ Live events sync cron job scheduled');
  console.log('   Schedule: Every 4 hours');
  console.log('   Next run: ' + getNextRunTime());

  // Run immediately on startup (after 10 seconds)
  setTimeout(() => {
    console.log('\n🚀 Running initial live events sync...');
    syncAllLiveEvents();
  }, 10000);
}

/**
 * Manual trigger for API endpoint
 */
async function manualSync(source = 'all') {
  console.log(`🔄 Manual sync triggered for: ${source}`);

  const results = {};

  if (source === 'all' || source === 'eventbrite') {
    results.eventbrite = await syncEventbrite();
  }

  if (source === 'all' || source === 'facebook') {
    results.facebook = await syncFacebook();
  }

  return results;
}

module.exports = {
  scheduleLiveEventsSync,
  syncAllLiveEvents,
  manualSync,
};