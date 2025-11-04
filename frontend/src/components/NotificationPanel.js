import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import { notificationService } from '../services/notificationService';

const NotificationPanel = () => {
    const [notificationType, setNotificationType] = useState('direct');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ show: false, type: '', message: '' });
    const [notifications, setNotifications] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ show: false, type: '', message: '' });

        try {
            if (notificationType === 'direct' && !userId) {
                setStatus({
                    show: true,
                    type: 'danger',
                    message: 'Se requiere el ID del usuario para notificaciones directas'
                });
                return;
            }

            if (!message) {
                setStatus({
                    show: true,
                    type: 'danger',
                    message: 'El mensaje es requerido'
                });
                return;
            }

            const response = notificationType === 'direct'
                ? await notificationService.sendDirectNotification(userId, message)
                : await notificationService.sendBroadcastNotification(message);

            // Agregar la notificación a la lista
            const newNotification = {
                id: Date.now(),
                type: notificationType,
                message,
                userId: notificationType === 'direct' ? userId : null,
                timestamp: new Date().toLocaleString()
            };

            setNotifications(prev => [...prev, newNotification]);

            setStatus({
                show: true,
                type: 'success',
                message: `Notificación enviada exitosamente! ${response.message}`
            });

            // Limpiar el formulario
            if (notificationType === 'direct') {
                setUserId('');
            }
            setMessage('');

        } catch (error) {
            setStatus({
                show: true,
                type: 'danger',
                message: `Error al enviar la notificación: ${error.response?.data?.message || error.message}`
            });
        }
    };

    return (
        <Container className="py-4">
            <Row>
                {/* Panel de envío de notificaciones */}
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header as="h4" className="text-center">
                            Enviar Notificación
                        </Card.Header>
                        <Card.Body>
                            {status.show && (
                                <Alert variant={status.type} onClose={() => setStatus({ ...status, show: false })} dismissible>
                                    {status.message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Notificación</Form.Label>
                                    <Form.Select
                                        value={notificationType}
                                        onChange={(e) => setNotificationType(e.target.value)}
                                    >
                                        <option value="direct">Directa (usuario específico)</option>
                                        <option value="broadcast">Broadcast (todos los usuarios)</option>
                                    </Form.Select>
                                </Form.Group>

                                {notificationType === 'direct' && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>ID de Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el ID del usuario"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Escribe el mensaje de la notificación"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        Enviar Notificación
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lista de notificaciones */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Notificaciones Enviadas</h4>
                            {notifications.length > 0 && (
                                <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => setNotifications([])}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {notifications.length === 0 ? (
                                <p className="text-muted text-center">No hay notificaciones</p>
                            ) : (
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {notifications.map((notification) => (
                                        <Alert 
                                            key={notification.id}
                                            variant={notification.type === 'direct' ? 'primary' : 'info'}
                                            className="mb-2"
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">
                                                    {notification.timestamp}
                                                </small>
                                                <Badge bg={notification.type === 'direct' ? 'primary' : 'info'}>
                                                    {notification.type === 'direct' ? 'Directa' : 'Broadcast'}
                                                </Badge>
                                            </div>
                                            <hr className="my-2" />
                                            <p className="mb-0">{notification.message}</p>
                                            {notification.userId && (
                                                <small className="text-muted d-block mt-1">
                                                    Usuario: {notification.userId}
                                                </small>
                                            )}
                                        </Alert>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NotificationPanel;