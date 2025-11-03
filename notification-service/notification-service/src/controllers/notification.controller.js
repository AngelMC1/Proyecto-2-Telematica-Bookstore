import { NotificationService } from '../services/notification.service.js';

export const sendNotification = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const result = await NotificationService.sendEmail(to, subject, message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
