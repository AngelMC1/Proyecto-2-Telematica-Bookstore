import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Button, Card, Alert } from "react-bootstrap";
import { cartService } from '../services/cartService';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`http://bookstore-alb-192888883.us-east-1.elb.amazonaws.com:5001/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => console.error("Error al obtener el libro:", err));
  }, [id]);

  if (!book) {
    return (
      <Container className="mt-5 text-center">
        <h4>Cargando libro...</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={5}>
          <Image src={book.image} alt={book.name} fluid rounded />
        </Col>
        <Col md={7}>
          <Card className="p-4 shadow-sm">
            <h2>{book.name}</h2>
            <h5 className="text-muted">{book.author}</h5>
            <p className="mt-3">{book.description}</p>
            <p>
              <strong>Precio:</strong> ${book.price}
            </p>
            <p>
              <strong>Stock disponible:</strong> {book.countInStock}
            </p>
            <Button 
              variant="success" 
              disabled={book.countInStock === 0}
              onClick={async () => {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const userId = user?._id || user?.id;
                
                console.log('Usuario al agregar al carrito:', user);
                console.log('User ID disponible:', userId);
                
                if (!userId) {
                  setMessage('Debes iniciar sesión');
                  return;
                }
                
                try {
                  const bookId = book._id || book.id;
                  console.log('Agregando al carrito - User ID:', userId, 'Book ID:', bookId);
                  
                  // Enviar datos completos del libro al carrito
                  const cartItem = {
                    book_id: bookId,
                    name: book.name,
                    price: book.price,
                    quantity: 1
                  };
                  
                  await cartService.addToCartWithData(userId, cartItem);
                  setMessage('✅ Agregado al carrito');
                  setTimeout(() => setMessage(''), 3000);
                } catch (error) {
                  console.error('Error al agregar al carrito:', error);
                  setMessage('❌ Error al agregar: ' + error.message);
                }
              }}
            >
              {book.countInStock > 0 ? "Agregar al carrito 🛒" : "Agotado "}
            </Button>
            {message && <Alert variant="info" className="mt-3">{message}</Alert>}
            <div className="mt-3">
              <Link to="/" className="btn btn-outline-secondary">
                ← Volver al catálogo
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetail;
