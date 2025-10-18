const axios = require('axios');
const Event = require('../models/Event');

class FacebookEventsService {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.pageId = process.env.FACEBOOK_PAGE_ID;
    this.baseURL = 'https://graph.facebook.com/v18.0';
    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        access_token: this.accessToken,
      },
    });
  }

  /**
   * Search for events near Pattaya
   */
  async searchEvents(params = {}) {
    try {
      const {
        latitude = 12.9236,
        longitude = 100.8825,
        distance = 50000, // 50km in meters
        since = Math.floor(Date.now() / 1000), // Current timestamp
        limit = 100,
      } = params;

      // Search for pages/places in Pattaya
      const searchResponse = await this.client.get('/search', {
        params: {
          type: 'place',
          center: `${latitude},${longitude}`,
          distance: distance,
          q: 'Pattaya',
          fields: 'id,name,events{id,name,description,start_time,end_time,place,cover,ticket_uri,is_canceled}',
          limit: limit,
        },
      });

      const allEvents = [];
      
      // Extract events from each place
      if (searchResponse.data.data) {
        for (const place of searchResponse.data.data) {
          if (place.events && place.events.data) {
            allEvents.push(...place.events.data);
          }
        }
      }

      return allEvents;
    } catch (error) {
      console.error('❌ Facebook Events search error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get events from a specific page
   */
  async getPageEvents(pageId = null) {
    try {
      const targetPageId = pageId || this.pageId;

      if (!targetPageId) {
        throw new Error('Facebook Page ID not configured');
      }

      const response = await this.client.get(`/${targetPageId}/events`, {
        params: {
          fields: 'id,name,description,start_time,end_time,place,cover,ticket_uri,is_canceled,event_times,attending_count,interested_count,category',
          time_filter: 'upcoming',
          limit: 100,
        },
      });

      return response.data.data || [];
    } catch (error) {
      console.error('❌ Error fetching page events:', error.message);
      throw error;
    }
  }

  /**
   * Get event details by ID
   */
  async getEventById(eventId) {
    try {
      const response = await this.client.get(`/${eventId}`, {
        params: {
          fields: 'id,name,description,start_time,end_time,place,cover,ticket_uri,is_canceled,event_times,attending_count,interested_count,category,owner',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching event ${eventId}:`, error.message);
      throw error;
    }
  }

  /**
   * Transform Facebook event to our schema
   */
  transformEvent(fbEvent) {
    const place = fbEvent.place || {};
    const location = place.location || {};

    return {
      externalId: fbEvent.id,
      externalSource: 'facebook',
      externalUrl: `https://www.facebook.com/events/${fbEvent.id}`,
      title: fbEvent.name,
      description: fbEvent.description || '',
      type: this.determineCategoryFromName(fbEvent.name, fbEvent.category),
      date: new Date(fbEvent.start_time),
      endDate: fbEvent.end_time ? new Date(fbEvent.end_time) : null,
      location: place.name || 'Pattaya',
      address: this.formatAddress(location),
      latitude: location.latitude || 12.9236,
      longitude: location.longitude || 100.8825,
      imageUrl: fbEvent.cover?.source || null,
      images: fbEvent.cover ? [fbEvent.cover.source] : [],
      price: 0, // Facebook doesn't provide price info
      priceCategory: 'free',
      ticketUrl: fbEvent.ticket_uri || `https://www.facebook.com/events/${fbEvent.id}`,
      status: fbEvent.is_canceled ? 'cancelled' : 'published',
      attendees: fbEvent.attending_count || 0,
      interested: fbEvent.interested_count || 0,
      organizer: fbEvent.owner ? {
        name: fbEvent.owner.name,
        facebookId: fbEvent.owner.id,
      } : null,
      tags: this.extractTags(fbEvent),
      socialLinks: {
        facebook: `https://www.facebook.com/events/${fbEvent.id}`,
      },
    };
  }

  /**
   * Format address from Facebook location
   */
  formatAddress(location) {
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    if (location.country) parts.push(location.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Pattaya, Thailand';
  }

  /**
   * Determine event category from name and description
   */
  determineCategoryFromName(name, category) {
    const text = (name + ' ' + (category || '')).toLowerCase();

    const typeKeywords = {
      'concert': ['concert', 'music', 'live music', 'band', 'dj', 'performance'],
      'festival': ['festival', 'fest', 'celebration'],
      'nightlife': ['party', 'club', 'nightlife', 'night out'],
      'sports': ['sports', 'tournament', 'match', 'game', 'fitness'],
      'cultural': ['art', 'culture', 'exhibition', 'museum', 'theater'],
      'market': ['market', 'fair', 'bazaar'],
    };

    for (const [type, keywords] of Object.entries(typeKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return type;
      }
    }

    return 'other';
  }

  /**
   * Extract tags from event
   */
  extractTags(fbEvent) {
    const tags = [];

    if (fbEvent.category) tags.push(fbEvent.category.toLowerCase());
    if (fbEvent.is_online) tags.push('online');
    if (fbEvent.attending_count > 100) tags.push('popular');

    // Extract from name
    const name = fbEvent.name.toLowerCase();
    if (name.includes('free')) tags.push('free');
    if (name.includes('live')) tags.push('live');
    if (name.includes('party')) tags.push('party');

    return tags;
  }

  /**
   * Sync events to database
   */
  async syncEvents(events) {
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (const fbEvent of events) {
      try {
        const eventData = this.transformEvent(fbEvent);

        // Check if event already exists
        const existing = await Event.findOne({
          externalId: eventData.externalId,
          externalSource: 'facebook',
        });

        if (existing) {
          // Update existing event
          await Event.findByIdAndUpdate(existing._id, eventData, {
            runValidators: true,
          });
          results.updated++;
          console.log(`  ✅ Updated: ${eventData.title}`);
        } else {
          // Create new event
          await Event.create(eventData);
          results.created++;
          console.log(`  ✅ Created: ${eventData.title}`);
        }
      } catch (error) {
        results.errors.push({
          eventId: fbEvent.id,
          error: error.message,
        });
        console.error(`  ❌ Error syncing event ${fbEvent.id}:`, error.message);
      }
    }

    return results;
  }
}

module.exports = new FacebookEventsService();