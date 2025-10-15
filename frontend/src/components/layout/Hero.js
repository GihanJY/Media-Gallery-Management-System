import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  function handleDashboardRedirect() {
    navigate("/dashboard");
  }

  function handleGetStarted() {
    navigate("/register");
  }

  return (
    <div>
      {/* Left-aligned Hero with Image */}
      <Container className="col-xxl-8 px-4 py-5">
        <Row className="flex-lg-row-reverse align-items-center g-5 py-5">
          <Col xs={10} sm={8} lg={6}>
            <img 
              src="collage.png" 
              className="d-block mx-lg-auto img-fluid" 
              alt="Media Gallery Dashboard" 
              width="700" 
              height="500" 
              loading="lazy" 
            />
          </Col>
          <Col lg={6}>
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              Organize, Manage, and Share Your Media Effortlessly
            </h1>
            {isAuthenticated ? (
              <div>
                <p className="lead">
                  Welcome back, {user?.name || "user"}! Your media gallery is ready. 
                  Upload, organize, and share your photos and videos with powerful tools 
                  designed for seamless content management.
                </p>
              </div>
            ) : (
              <div>
                <p className="lead">
                  Transform the way you store and showcase your media. Our powerful gallery 
                  management system helps you organize thousands of files, create stunning 
                  collections, and share them with the world.
                </p>
              </div>
            )}
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {isAuthenticated ? (
                <div>
                  <Button variant="primary" size="lg" className="px-4 me-md-2" onClick={handleDashboardRedirect}>
                    Go To Dashboard
                  </Button>
                </div>
              ) : (
                <div>
                  <Button variant="primary" size="lg" className="px-4 me-md-2" onClick={handleGetStarted}>
                    Get Started Free
                  </Button>
                  <Button variant="outline-secondary" size="lg" className="px-4" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;