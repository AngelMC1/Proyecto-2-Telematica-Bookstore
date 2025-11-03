import { EmailClient } from '../utils/emailClient.js';

export const NotificationService = {
  async sendEmail(to, subject, message) {
    const emailResponse = await EmailClient.send(to, subject, message);
    return emailResponse;
  }
};
