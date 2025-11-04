import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Recuperar notificaciones almacenadas
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            setNotifications(JSON.parse(storedNotifications));
        }

        // Escuchar nuevas notificaciones
        const handleNewNotification = (event) => {
            const notification = event.detail;
            setNotifications(prev => {
                const newNotifications = [...prev, {
                    ...notification,
                    id: Date.now(),
                    timestamp: new Date().toLocaleString()
                }];
                // Guardar en localStorage
                localStorage.setItem('notifications', JSON.stringify(newNotifications));
                return newNotifications;
            });
        };

        // Suscribirse al evento personalizado de notificación
        window.addEventListener('new-notification', handleNewNotification);

        return () => {
            window.removeEventListener('new-notification', handleNewNotification);
        };
    }, []);

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem('notifications');
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Notificaciones Recibidas</h3>
                {notifications.length > 0 && (
                    <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={clearNotifications}
                    >
                        Limpiar Notificaciones
                    </button>
                )}
            </div>
            {notifications.length === 0 ? (
                <p className="text-muted">No hay notificaciones</p>
            ) : (
                <ListGroup>
                    {notifications.map((notification) => (
                        <ListGroup.Item 
                            key={notification.id}
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">{notification.type}</div>
                                {notification.message}
                                <div className="text-muted small">{notification.timestamp}</div>
                            </div>
                            <Badge 
                                bg={notification.type === 'direct' ? 'primary' : 'info'}
                                pill
                            >
                                {notification.type === 'direct' ? 'Directa' : 'Broadcast'}
                            </Badge>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default NotificationList;