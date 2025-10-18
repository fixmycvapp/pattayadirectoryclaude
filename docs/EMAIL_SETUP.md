# Email Setup Guide

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Name it "Pattaya Directory"
4. Copy the 16-character password

### Step 3: Update .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@pattayadirectory.com
SMTP_FROM_NAME=Pattaya Directory

curl -X POST http://localhost:5000/api/admin/email/test-send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"to":"your-test-email@gmail.com"}'

  const emailService = require('./services/emailService');

(async () => {
  const result = await emailService.sendTestEmail('your-email@gmail.com');
  console.log(result);
})();