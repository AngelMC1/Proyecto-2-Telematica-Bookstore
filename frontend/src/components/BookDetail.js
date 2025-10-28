import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Image, Button, Card } from "react-bootstrap";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/books/${id}`)
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
            <Button variant="success" disabled={book.countInStock === 0}>
              {book.countInStock > 0 ? "Agregar al carrito 🛒" : "Agotado "}
            </Button>
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
