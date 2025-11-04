import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { cartService } from '../services/cartService';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Debug del usuario
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  console.log('Usuario en Cart:', user);
  console.log('User ID disponible:', user?._id || user?.id);
  
  useEffect(() => {
    loadCart();
  }, []);
  
  const loadCart = async () => {
    const userId = user?._id || user?.id;
    console.log('Intentando cargar carrito para usuario:', userId);
    
    if (!userId) {
      setError('Debes iniciar sesión');
      setLoading(false);
      return;
    }
    
    try {
      const response = await cartService.getCart(userId);
      console.log('Respuesta del carrito:', response.data);
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
      setError('Error al cargar el carrito: ' + err.message);
      setLoading(false);
    }
  };
  
  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    const userId = user?._id || user?.id;
    try {
      await cartService.updateCartItem(userId, bookId, newQuantity);
      loadCart();
    } catch (err) {
      setError('Error al actualizar');
    }
  };
  
  const handleRemove = async (bookId) => {
    const userId = user?._id || user?.id;
    try {
      await cartService.removeFromCart(userId, bookId);
      loadCart();
    } catch (err) {
      setError('Error al eliminar');
    }
  };
  
  const handleClear = async () => {
    if (!window.confirm('¿Vaciar carrito?')) return;
    const userId = user?._id || user?.id;
    try {
      await cartService.clearCart(userId);
      loadCart();
    } catch (err) {
      setError('Error al vaciar');
    }
  };
  
  if (loading) return <Container className="mt-5"><h3>Cargando...</h3></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!cart || cart.items.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Tu carrito está vacío</Alert>
        <Button href="/">Ir al catálogo</Button>
      </Container>
    );
  }
  
  return (
    <Container className="mt-5">
      <h2>Mi Carrito</h2>
      {cart.items.map((item) => (
        <Card key={item.book_id} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={2}>
                <img src={item.image} alt={item.name} style={{width: '100%'}} />
              </Col>
              <Col md={6}>
                <h5>{item.name}</h5>
                <p>Precio: ${item.price}</p>
              </Col>
              <Col md={2}>
                <Button size="sm" onClick={() => handleUpdateQuantity(item.book_id, item.quantity - 1)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button size="sm" onClick={() => handleUpdateQuantity(item.book_id, item.quantity + 1)}>+</Button>
              </Col>
              <Col md={2}>
                <Button variant="danger" onClick={() => handleRemove(item.book_id)}>Eliminar</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <h3>Total: ${cart.total}</h3>
      <Button variant="warning" onClick={handleClear}>Vaciar Carrito</Button>
      <Button variant="success" className="ms-2">Checkout</Button>
    </Container>
  );
}

export default Cart;
