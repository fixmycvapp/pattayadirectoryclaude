const nodemailer = require('nodemailer');
const { format } = require('date-fns');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Connection pool settings
      pool: true,
      maxConnections: 5,
      maxMessages: 10,
    });

    this.fromEmail = process.env.SMTP_FROM || 'noreply@pattayadirectory.com';
    this.fromName = process.env.SMTP_FROM_NAME || 'Pattaya Directory';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  /**
   * Send event reminder email
   */
  async sendEventReminder({ to, userName, event, customMessage, reminderType = 'standard' }) {
    try {
      const eventDate = format(new Date(event.date), 'PPPp');
      const eventTime = format(new Date(event.date), 'p');
      const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));

      const templateData = {
        userName,
        event: {
          ...event,
          formattedDate: eventDate,
          formattedTime: eventTime,
          daysUntil,
        },
        customMessage,
        eventUrl: `${this.frontendUrl}/events/${event._id}`,
        profileUrl: `${this.frontendUrl}/profile`,
        unsubscribeUrl: `${this.frontendUrl}/unsubscribe`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('event-reminder', templateData);
      const subject = this.getReminderSubject(event, daysUntil, reminderType);

      await this.sendMail({
        to,
        subject,
        html,
        category: 'reminder',
        metadata: {
          eventId: event._id,
          userId: to,
          reminderType,
        },
      });

      console.log(`✅ Reminder email sent to ${to} for event: ${event.title}`);
      return { success: true, messageId: Date.now() };

    } catch (error) {
      console.error('❌ Error sending reminder email:', error);
      throw error;
    }
  }

  /**
   * Send reminder digest (multiple events)
   */
  async sendReminderDigest({ to, userName, reminders }) {
    try {
      const templateData = {
        userName,
        reminders: reminders.map(r => ({
          ...r.event,
          formattedDate: format(new Date(r.event.date), 'PPP'),
          eventUrl: `${this.frontendUrl}/events/${r.event._id}`,
        })),
        totalReminders: reminders.length,
        profileUrl: `${this.frontendUrl}/profile`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('reminder-digest', templateData);

      await this.sendMail({
        to,
        subject: `🔔 ${reminders.length} Event Reminders for You`,
        html,
        category: 'digest',
      });

      console.log(`✅ Digest email sent to ${to} with ${reminders.length} reminders`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending digest email:', error);
      throw error;
    }
  }

  /**
   * Send reminder confirmation email (when user sets a reminder)
   */
  async sendReminderConfirmation({ to, userName, event, reminderDate }) {
    try {
      const templateData = {
        userName,
        event: {
          ...event,
          formattedDate: format(new Date(event.date), 'PPPp'),
        },
        reminderDate: format(new Date(reminderDate), 'PPPp'),
        eventUrl: `${this.frontendUrl}/events/${event._id}`,
        manageUrl: `${this.frontendUrl}/profile`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('reminder-confirmation', templateData);

      await this.sendMail({
        to,
        subject: `✅ Reminder Set: ${event.title}`,
        html,
        category: 'confirmation',
      });

      console.log(`✅ Confirmation email sent to ${to}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending confirmation email:', error);
      throw error;
    }
  }

  /**
   * Send event cancellation notification
   */
  async sendEventCancellation({ to, userName, event, reason }) {
    try {
      const templateData = {
        userName,
        event: {
          ...event,
          formattedDate: format(new Date(event.date), 'PPPp'),
        },
        reason: reason || 'The event organizer has cancelled this event.',
        browseUrl: `${this.frontendUrl}/events`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('event-cancellation', templateData);

      await this.sendMail({
        to,
        subject: `❌ Event Cancelled: ${event.title}`,
        html,
        category: 'cancellation',
        priority: 'high',
      });

      console.log(`✅ Cancellation email sent to ${to}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending cancellation email:', error);
      throw error;
    }
  }

  /**
   * Send event update notification
   */
  async sendEventUpdate({ to, userName, event, changes }) {
    try {
      const templateData = {
        userName,
        event: {
          ...event,
          formattedDate: format(new Date(event.date), 'PPPp'),
        },
        changes,
        eventUrl: `${this.frontendUrl}/events/${event._id}`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('event-update', templateData);

      await this.sendMail({
        to,
        subject: `📝 Event Updated: ${event.title}`,
        html,
        category: 'update',
      });

      console.log(`✅ Update email sent to ${to}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending update email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail({ to, userName }) {
    try {
      const templateData = {
        userName,
        exploreUrl: `${this.frontendUrl}/events`,
        profileUrl: `${this.frontendUrl}/profile`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('welcome', templateData);

      await this.sendMail({
        to,
        subject: '👋 Welcome to Pattaya Directory!',
        html,
        category: 'welcome',
      });

      console.log(`✅ Welcome email sent to ${to}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send weekly digest of upcoming events
   */
  async sendWeeklyDigest({ to, userName, events, savedEvents }) {
    try {
      const templateData = {
        userName,
        events: events.map(e => ({
          ...e,
          formattedDate: format(new Date(e.date), 'EEE, MMM d'),
          eventUrl: `${this.frontendUrl}/events/${e._id}`,
        })),
        savedEvents: savedEvents.map(e => ({
          ...e,
          formattedDate: format(new Date(e.date), 'EEE, MMM d'),
          eventUrl: `${this.frontendUrl}/events/${e._id}`,
        })),
        browseUrl: `${this.frontendUrl}/events`,
        unsubscribeUrl: `${this.frontendUrl}/unsubscribe`,
        currentYear: new Date().getFullYear(),
      };

      const html = await this.renderTemplate('weekly-digest', templateData);

      await this.sendMail({
        to,
        subject: '📅 Your Weekly Events Digest',
        html,
        category: 'digest',
      });

      console.log(`✅ Weekly digest sent to ${to}`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error sending weekly digest:', error);
      throw error;
    }
  }

  /**
   * Core send mail function
   */
  async sendMail({ to, subject, html, text, category, priority = 'normal', metadata = {} }) {
    try {
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
        priority,
        headers: {
          'X-Category': category,
          'X-Metadata': JSON.stringify(metadata),
        },
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };

    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Render email template
   */
  async renderTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.ejs`);
      const template = await fs.readFile(templatePath, 'utf-8');
      return ejs.render(template, data);
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error);
      
      // Fallback to inline template
      return this.getInlineTemplate(templateName, data);
    }
  }

  /**
   * Get reminder subject based on days until event
   */
  getReminderSubject(event, daysUntil, type) {
    if (type === 'urgent') {
      return `⏰ TOMORROW: ${event.title}`;
    }
    
    if (daysUntil === 0) {
      return `🎉 TODAY: ${event.title}`;
    } else if (daysUntil === 1) {
      return `⏰ Tomorrow: ${event.title}`;
    } else if (daysUntil <= 7) {
      return `🔔 Coming Up in ${daysUntil} Days: ${event.title}`;
    } else {
      return `🔔 Reminder: ${event.title}`;
    }
  }

  /**
   * Convert HTML to plain text
   */
  htmlToText(html) {
    return html
      .replace(/<style[^>]*>.*<\/style>/gm, '')
      .replace(/<[^>]+>/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Inline template fallback for event reminder
   */
  getInlineTemplate(templateName, data) {
    if (templateName === 'event-reminder') {
      return this.getEventReminderTemplate(data);
    }
    
    // Generic fallback
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Notification from Pattaya Directory</h1>
          <p>This is an automated message.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Event reminder template
   */
  getEventReminderTemplate(data) {
    const { userName, event, customMessage, eventUrl, daysUntil } = data;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; }
          .email-wrapper { background-color: #f3f4f6; padding: 40px 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: 700; }
          .header p { font-size: 16px; opacity: 0.95; }
          .bell-icon { font-size: 48px; margin-bottom: 15px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; }
          .message-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px 20px; margin: 20px 0; border-radius: 6px; }
          .message-box p { color: #1e40af; font-style: italic; }
          .event-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #bae6fd; }
          .event-image { width: 100%; height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
          .event-title { font-size: 24px; font-weight: 700; color: #0c4a6e; margin-bottom: 15px; }
          .event-details { margin: 15px 0; }
          .event-detail { display: flex; align-items: center; margin: 10px 0; font-size: 15px; color: #334155; }
          .event-detail-icon { margin-right: 10px; font-size: 18px; }
          .countdown { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; border: 2px solid #fcd34d; }
          .countdown-text { font-size: 20px; font-weight: 700; color: #92400e; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
          .cta-button:hover { transform: translateY(-2px); }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .footer-links { margin: 15px 0; }
          .footer-link { color: #2563eb; text-decoration: none; margin: 0 10px; }
          .social-links { margin: 20px 0; }
          .social-link { display: inline-block; margin: 0 8px; color: #6b7280; text-decoration: none; }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .content { padding: 25px 20px; }
            .header { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
            .event-title { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <div class="bell-icon">🔔</div>
              <h1>Event Reminder</h1>
              <p>Don't miss out on this amazing event!</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p class="greeting">Hi ${userName},</p>
              <p>This is your friendly reminder about an upcoming event you saved:</p>

              ${customMessage ? `
                <div class="message-box">
                  <p>"${customMessage}"</p>
                </div>
              ` : ''}

              ${daysUntil <= 1 ? `
                <div class="countdown">
                  <div class="countdown-text">
                    ${daysUntil === 0 ? '🎉 TODAY!' : '⏰ TOMORROW!'}
                  </div>
                </div>
              ` : daysUntil <= 7 ? `
                <div class="countdown">
                  <div class="countdown-text">
                    📅 Coming up in ${daysUntil} days
                  </div>
                </div>
              ` : ''}

              <!-- Event Card -->
              <div class="event-card">
                ${event.imageUrl ? `
                  <img src="${event.imageUrl}" alt="${event.title}" class="event-image">
                ` : ''}
                
                <h2 class="event-title">${event.title}</h2>

                <div class="event-details">
                  <div class="event-detail">
                    <span class="event-detail-icon">📅</span>
                    <strong>Date:</strong>&nbsp;${event.formattedDate}
                  </div>
                  
                  <div class="event-detail">
                    <span class="event-detail-icon">⏰</span>
                    <strong>Time:</strong>&nbsp;${event.formattedTime}
                  </div>
                  
                  <div class="event-detail">
                    <span class="event-detail-icon">📍</span>
                    <strong>Location:</strong>&nbsp;${event.location}
                  </div>

                  ${event.price ? `
                    <div class="event-detail">
                      <span class="event-detail-icon">💰</span>
                      <strong>Price:</strong>&nbsp;${event.price === 0 ? 'FREE' : `฿${event.price}`}
                    </div>
                  ` : ''}
                </div>

                ${event.description ? `
                  <p style="margin-top: 15px; color: #475569; line-height: 1.6;">
                    ${event.description.substring(0, 200)}${event.description.length > 200 ? '...' : ''}
                  </p>
                ` : ''}

                <center>
                  <a href="${eventUrl}" class="cta-button">
                    View Event Details →
                  </a>
                </center>
              </div>

              <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin-top: 25px;">
                <p style="margin: 0; color: #0369a1; font-size: 14px;">
                  <strong>💡 Tip:</strong> Arrive early to get the best seats, and don't forget to check the weather forecast!
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-links">
                <a href="${data.profileUrl}" class="footer-link">Manage Reminders</a>
                <span style="color: #d1d5db;">|</span>
                <a href="${data.unsubscribeUrl}" class="footer-link">Unsubscribe</a>
              </div>

              <div class="social-links">
                <a href="#" class="social-link">Facebook</a>
                <a href="#" class="social-link">Instagram</a>
                <a href="#" class="social-link">Twitter</a>
              </div>

              <p style="margin-top: 20px;">
                <strong>Pattaya Directory</strong><br>
                Your guide to the best events in Pattaya, Thailand
              </p>
              
              <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                You're receiving this email because you set a reminder for this event.<br>
                © ${data.currentYear} Pattaya Directory. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test email connection
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email server is ready to send messages');
      return { success: true, message: 'Email server connected' };
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send test email
   */
  async sendTestEmail(to) {
    try {
      await this.sendMail({
        to,
        subject: '✅ Test Email - Pattaya Directory',
        html: `
          <h1>Email Configuration Working!</h1>
          <p>If you're reading this, your email service is configured correctly.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
        category: 'test',
      });

      return { success: true, message: 'Test email sent successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();