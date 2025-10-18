// Add to existing schema
externalId: {
  type: String,
  sparse: true,
  index: true,
},
externalSource: {
  type: String,
  enum: ['eventbrite', 'facebook', 'manual'],
  index: true,
},
externalUrl: {
  type: String,
},
attendees: {
  type: Number,
  default: 0,
},
interested: {
  type: Number,
  default: 0,
},
endDate: {
  type: Date,
},
ticketUrl: {
  type: String,
},
lastSyncedAt: {
  type: Date,
  default: Date.now,
},

// Add compound index for external events
eventSchema.index({ externalId: 1, externalSource: 1 }, { unique: true, sparse: true });