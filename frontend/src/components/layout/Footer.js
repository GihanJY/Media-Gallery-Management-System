import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-primary text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Media Gallery</h5>
            <p className="">
              The modern solution for organizing, managing, and sharing your photo and video 
              collections. Trusted by photographers, content creators, and businesses worldwide.
            </p>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-decoration-none text-white">Home</a></li>
              <li><a href="#features" className="text-decoration-none text-white">Features</a></li>
              <li><a href="/pricing" className="text-decoration-none text-white">Pricing</a></li>
              <li><a href="/support" className="text-decoration-none text-white">Support</a></li>
              <li><a href="/about" className="text-decoration-none text-white">About Us</a></li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Contact</h5>
            <address className="text-white">
              <div className="mb-2">Email: support@mediagallery.com</div>
              <div className="mb-2">Phone: +1 (555) 123-4567</div>
              <div>Available Mon-Fri, 9AM-6PM EST</div>
            </address>
          </Col>
        </Row>
        
        <hr className="my-4 bg-secondary" />
        
        <Row>
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <small className='text-white'>&copy; {new Date().getFullYear()} Media Gallery. All rights reserved.</small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <small>
              <a href="/privacy" className="text-white text-decoration-none me-3">Privacy Policy</a>
              <a href="/terms" className="text-white text-decoration-none">Terms of Service</a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;