import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error al obtener los libros:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Catálogo de Libros</h2>

      {loading ? (

        <div className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3">Cargando libros...</p>
        </div>
      ) : books.length > 0 ? (

        <Row>
          {books.map((book) => (
            <Col key={book._id} md={4} className="mb-4">
              <Card
                className="shadow-sm h-100"
                style={{ transition: "0.3s", cursor: "pointer" }}
              >
                <Link
                  to={`/book/${book._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card.Img
                    variant="top"
                    src={book.image}
                    height="350"
                    style={{ objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{book.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {book.author}
                    </Card.Subtitle>
                    <Card.Text>
                      {book.description?.substring(0, 100)}...
                    </Card.Text>
                    <Card.Text>
                      <strong>${book.price}</strong>
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-4">No hay libros disponibles </p>
      )}
    </Container>
  );
};

export default BookList;
