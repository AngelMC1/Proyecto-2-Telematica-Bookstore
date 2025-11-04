import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5002/api/users/login", form);
      const user = res.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      alert(`Bienvenido ${user.name}`);
      window.location.href = "/";
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3>Iniciar Sesión</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="success">Ingresar</Button>
      </Form>
    </Container>
  );
};

export default Login;
