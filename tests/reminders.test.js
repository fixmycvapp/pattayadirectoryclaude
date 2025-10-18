/**
 * Manual API Testing Guide for Reminders
 */

// ============================================
// 1. CREATE REMINDER
// ============================================
/*
curl -X POST http://localhost:5000/api/reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "eventId": "67301a2f4b8c9d001e5f2a3b",
    "reminderDate": "2025-12-14T09:00:00.000Z",
    "reminderType": "email",
    "customMessage": "Don'"'"'t forget to buy tickets!"
  }'
*/

// ============================================
// 2. GET ALL REMINDERS
// ============================================
/*
curl -X GET http://localhost:5000/api/reminders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
*/

// ============================================
// 3. GET UPCOMING REMINDERS
// ============================================
/*
curl -X GET http://localhost:5000/api/reminders/upcoming \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
*/

// ============================================
// 4. UPDATE REMINDER
// ============================================
/*
curl -X PUT http://localhost:5000/api/reminders/REMINDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "reminderDate": "2025-12-13T18:00:00.000Z",
    "reminderType": "both"
  }'
*/

// ============================================
// 5. SNOOZE REMINDER
// ============================================
/*
curl -X PATCH http://localhost:5000/api/reminders/REMINDER_ID/snooze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"snoozeMinutes": 30}'
*/

// ============================================
// 6. DELETE REMINDER
// ============================================
/*
curl -X DELETE http://localhost:5000/api/reminders/REMINDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
*/

// ============================================
// 7. CREATE BULK REMINDERS
// ============================================
/*
curl -X POST http://localhost:5000/api/reminders/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "eventIds": ["EVENT_ID_1", "EVENT_ID_2", "EVENT_ID_3"],
    "reminderDate": "2025-12-20T10:00:00.000Z",
    "reminderType": "email"
  }'
*/

// ============================================
// 8. GET REMINDER STATISTICS
// ============================================
/*
curl -X GET http://localhost:5000/api/reminders/stats/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
*/