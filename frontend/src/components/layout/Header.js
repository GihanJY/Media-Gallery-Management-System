import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Company Logo"
          />
          Media Gallery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
                <Button variant="primary" onClick={handleRegisterClick}>
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <span className="fw-semibold mb-0">{user?.name || "User"}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
