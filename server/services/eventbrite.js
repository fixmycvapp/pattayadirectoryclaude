const axios = require('axios');
const Event = require('../models/Event');

class EventbriteService {
  constructor() {
    this.apiKey = process.env.EVENTBRITE_API_KEY;
    this.organizationId = process.env.EVENTBRITE_ORG_ID;
    this.baseURL = 'https://www.eventbriteapi.com/v3';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Search for events in Pattaya area
   */
  async searchEvents(params = {}) {
    try {
      const {
        location = 'Pattaya, Thailand',
        startDate = new Date().toISOString(),
        radius = '50km',
        categories = null,
        page = 1,
      } = params;

      const queryParams = {
        'location.address': location,
        'location.within': radius,
        'start_date.range_start': startDate,
        'expand': 'venue,organizer,category,ticket_availability',
        'page': page,
        'sort_by': 'date',
      };

      if (categories) {
        queryParams['categories'] = categories;
      }

      const response = await this.client.get('/events/search/', {
        params: queryParams,
      });

      return response.data;
    } catch (error) {
      console.error('❌ Eventbrite search error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get event details by ID
   */
  async getEventById(eventId) {
    try {
      const response = await this.client.get(`/events/${eventId}/`, {
        params: {
          expand: 'venue,organizer,category,ticket_availability,description',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching event ${eventId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get organization's events
   */
  async getOrganizationEvents() {
    try {
      if (!this.organizationId) {
        throw new Error('Organization ID not configured');
      }

      const response = await this.client.get(`/organizations/${this.organizationId}/events/`, {
        params: {
          expand: 'venue,organizer,category',
          status: 'live',
          order_by: 'start_asc',
        },
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching organization events:', error.message);
      throw error;
    }
  }

  /**
   * Transform Eventbrite event to our schema
   */
  transformEvent(ebEvent) {
    const venue = ebEvent.venue || {};
    const category = ebEvent.category || {};

    return {
      externalId: ebEvent.id,
      externalSource: 'eventbrite',
      externalUrl: ebEvent.url,
      title: ebEvent.name.text,
      description: ebEvent.description?.text || ebEvent.summary || '',
      type: this.mapCategoryToType(category.name),
      date: new Date(ebEvent.start.utc),
      endDate: new Date(ebEvent.end.utc),
      location: venue.name || 'Pattaya',
      address: venue.address ? 
        `${venue.address.address_1 || ''} ${venue.address.city || ''} ${venue.address.country || ''}`.trim() 
        : 'Pattaya, Thailand',
      latitude: venue.latitude ? parseFloat(venue.latitude) : 12.9236,
      longitude: venue.longitude ? parseFloat(venue.longitude) : 100.8825,
      imageUrl: ebEvent.logo?.url || ebEvent.logo?.original?.url || null,
      images: ebEvent.logo ? [ebEvent.logo.url] : [],
      price: this.extractPrice(ebEvent),
      priceCategory: this.determinePriceCategory(ebEvent),
      capacity: ebEvent.capacity || null,
      organizer: {
        name: ebEvent.organizer?.name || 'Unknown',
        email: ebEvent.organizer?.email || null,
        website: ebEvent.organizer?.website || null,
      },
      ticketUrl: ebEvent.url,
      status: ebEvent.status === 'live' ? 'published' : 'draft',
      tags: this.extractTags(ebEvent),
      featured: ebEvent.is_reserved_seating || false,
    };
  }

  /**
   * Map Eventbrite category to our event types
   */
  mapCategoryToType(categoryName) {
    const categoryMap = {
      'Music': 'concert',
      'Food & Drink': 'festival',
      'Nightlife': 'nightlife',
      'Arts': 'cultural',
      'Sports & Fitness': 'sports',
      'Community': 'cultural',
      'Business': 'conference',
      'Film & Media': 'cultural',
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (categoryName?.includes(key)) {
        return value;
      }
    }

    return 'other';
  }

  /**
   * Extract ticket price
   */
  extractPrice(ebEvent) {
    if (ebEvent.is_free) {
      return 0;
    }

    // Try ticket availability
    if (ebEvent.ticket_availability?.minimum_ticket_price) {
      return parseFloat(ebEvent.ticket_availability.minimum_ticket_price.major_value);
    }

    return 0; // Default to free if price not available
  }

  /**
   * Determine price category
   */
  determinePriceCategory(ebEvent) {
    const price = this.extractPrice(ebEvent);

    if (price === 0) return 'free';
    if (price < 500) return 'budget';
    if (price < 2000) return 'moderate';
    return 'premium';
  }

  /**
   * Extract tags from event
   */
  extractTags(ebEvent) {
    const tags = [];

    if (ebEvent.is_free) tags.push('free');
    if (ebEvent.is_online_event) tags.push('online');
    if (ebEvent.category?.name) tags.push(ebEvent.category.name.toLowerCase());
    if (ebEvent.subcategory?.name) tags.push(ebEvent.subcategory.name.toLowerCase());

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

    for (const ebEvent of events) {
      try {
        const eventData = this.transformEvent(ebEvent);

        // Check if event already exists
        const existing = await Event.findOne({
          externalId: eventData.externalId,
          externalSource: 'eventbrite',
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
          eventId: ebEvent.id,
          error: error.message,
        });
        console.error(`  ❌ Error syncing event ${ebEvent.id}:`, error.message);
      }
    }

    return results;
  }
}

module.exports = new EventbriteService();