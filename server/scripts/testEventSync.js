/**
 * Test script for live events sync
 * Usage: node server/scripts/testEventSync.js [eventbrite|facebook|all]
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { manualSync } = require('../cron/syncLiveEvents');

async function testSync(source = 'all') {
  try {
    console.log(`🧪 Testing live events sync for: ${source}\n`);

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pattaya-directory');
    console.log('✅ Connected to database\n');

    // Run sync
    const results = await manualSync(source);

    console.log('\n📊 Test Results:');
    
    if (results.eventbrite) {
      console.log('\nEventbrite:');
      console.log(`   Created: ${results.eventbrite.created}`);
      console.log(`   Updated: ${results.eventbrite.updated}`);
      console.log(`   Errors: ${results.eventbrite.errors.length}`);
    }

    if (results.facebook) {
      console.log('\nFacebook:');
      console.log(`   Created: ${results.facebook.created}`);
      console.log(`   Updated: ${results.facebook.updated}`);
      console.log(`   Errors: ${results.facebook.errors.length}`);
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

const source = process.argv[2] || 'all';
testSync(source);