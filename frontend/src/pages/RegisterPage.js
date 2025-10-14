import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Company Logo"
            />{" "}
            Media Gallery
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Center RegisterForm inside its own full-height flex container */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: 60, overflow: "hidden" }}
      >
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
