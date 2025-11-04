import { sendNotification } from '../rabbitmq.js';

export const notificationController = {
  // Send a direct notification to a specific user
  async sendDirectNotification(req, res) {
    try {
      const { userId, message, type, metadata } = req.body;

      if (!userId || !message) {
        return res.status(400).json({
          success: false,
          message: 'userId and message are required'
        });
      }

      await sendNotification({
        userId,
        message,
        type: type || 'direct',
        metadata: metadata || {},
        timestamp: new Date()
      });

      res.json({
        success: true,
        message: 'Notification queued successfully'
      });
    } catch (error) {
      console.error('Error sending direct notification:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing notification'
      });
    }
  },

  // Send a broadcast notification to all users
  async sendBroadcastNotification(req, res) {
    try {
      const { message, type, metadata } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'message is required'
        });
      }

      await sendNotification({
        message,
        type: type || 'broadcast',
        metadata: metadata || {},
        isBroadcast: true,
        timestamp: new Date()
      });

      res.json({
        success: true,
        message: 'Broadcast notification queued successfully'
      });
    } catch (error) {
      console.error('Error sending broadcast notification:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing broadcast notification'
      });
    }
  },

  // Send event-based notifications (for internal use)
  async sendEventNotification(eventType, data) {
    try {
      let message;
      let metadata = {};

      switch (eventType) {
        case 'USER_REGISTERED':
          message = `Welcome ${data.name}! Thank you for registering.`;
          break;
        case 'ORDER_PLACED':
          message = `Order #${data.orderId} has been placed successfully.`;
          metadata = { orderId: data.orderId };
          break;
        case 'BOOK_AVAILABLE':
          message = `The book "${data.title}" is now available!`;
          metadata = { bookId: data.bookId };
          break;
        default:
          message = data.message || 'New notification';
      }

      await sendNotification({
        userId: data.userId,
        message,
        type: 'event',
        metadata: { ...metadata, eventType },
        timestamp: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending event notification:', error);
      throw error;
    }
  }
};
