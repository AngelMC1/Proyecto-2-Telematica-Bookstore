import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NavigationBar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand> BookStore</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <LinkContainer to="/">
                  <Nav.Link>Inicio</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Registro</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                <Nav.Link href="/cart">🛒 Carrito</Nav.Link>
                <NavDropdown title={` Hola, ${user.name}`} id="user-menu" align="end">
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;


