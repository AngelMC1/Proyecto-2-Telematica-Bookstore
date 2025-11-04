import axios from 'axios';

const API_URL = process.env.REACT_APP_NOTIFICATION_SERVICE_URL || 'http://localhost:5003';

export const notificationService = {
    // Send a direct notification to a specific user
    sendDirectNotification: async (userId, message, type = 'direct', metadata = {}) => {
        try {
            const response = await axios.post(`${API_URL}/api/notifications/direct`, {
                userId,
                message,
                type,
                metadata
            });
            return response.data;
        } catch (error) {
            console.error('Error sending direct notification:', error);
            throw error;
        }
    },

    // Send a broadcast notification to all users
    sendBroadcastNotification: async (message, type = 'broadcast', metadata = {}) => {
        try {
            const response = await axios.post(`${API_URL}/api/notifications/broadcast`, {
                message,
                type,
                metadata
            });
            return response.data;
        } catch (error) {
            console.error('Error sending broadcast notification:', error);
            throw error;
        }
    }
};