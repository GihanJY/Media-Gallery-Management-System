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

  return (
    <div>
      {/* Left-aligned Hero with Image */}
      <Container className="col-xxl-8 px-4 py-5">
        <Row className="flex-lg-row-reverse align-items-center g-5 py-5">
          <Col xs={10} sm={8} lg={6}>
            <img 
              src="collage.png" 
              className="d-block mx-lg-auto img-fluid" 
              alt="Bootstrap Themes" 
              width="700" 
              height="500" 
              loading="lazy" 
            />
          </Col>
          <Col lg={6}>
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              Responsive left-aligned hero with image
            </h1>
            {isAuthenticated? <div>
              <p className="lead">
              Quickly design and customize { user?.name || "user" } responsive mobile-first sites with Bootstrap.
            </p>
            </div>: <div>
              <p className="lead">
              Quickly design and customize responsive mobile-first sites with Bootstrap.
            </p></div>}
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              {isAuthenticated? 
              <div>
                <Button variant="primary" size="lg" className="px-4 me-md-2" onClick={() => handleDashboardRedirect()}>
                Go To Dashboard
              </Button>
              </div> : <div>
                <Button variant="primary" size="lg" className="px-4 me-md-2">
                Primary
              </Button>
              <Button variant="outline-secondary" size="lg" className="px-4">
                Default
              </Button>
              </div>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Hero;