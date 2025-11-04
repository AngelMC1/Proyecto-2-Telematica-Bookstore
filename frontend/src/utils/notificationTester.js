import { notificationService } from '../services/notificationService';

// Función para probar notificación directa
export const testDirectNotification = async (userId) => {
    try {
        const response = await notificationService.sendDirectNotification(
            userId,
            "Esta es una notificación de prueba directa",
            "test"
        );
        console.log('Respuesta de notificación directa:', response);
        return response;
    } catch (error) {
        console.error('Error en notificación directa:', error);
        throw error;
    }
};

// Función para probar notificación broadcast
export const testBroadcastNotification = async () => {
    try {
        const response = await notificationService.sendBroadcastNotification(
            "Esta es una notificación de prueba broadcast",
            "test"
        );
        console.log('Respuesta de notificación broadcast:', response);
        return response;
    } catch (error) {
        console.error('Error en notificación broadcast:', error);
        throw error;
    }
};