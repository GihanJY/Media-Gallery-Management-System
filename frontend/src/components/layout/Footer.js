import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>About Us</h5>
            <p className="">
              Your company description goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-white">Home</a></li>
              <li><a href="#" className="text-decoration-none text-white">Features</a></li>
              <li><a href="#" className="text-decoration-none text-white">Pricing</a></li>
              <li><a href="#" className="text-decoration-none text-white">FAQ</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Contact</h5>
            <address className="text-white">
              123 Main Street<br />
              City, State 10001<br />
              <abbr title="Phone">P:</abbr> (123) 456-7890
            </address>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row className=''>
          <Col className="text-center text-muted">
            <small className='text-white'>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;