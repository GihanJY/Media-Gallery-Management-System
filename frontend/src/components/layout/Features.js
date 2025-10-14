import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Features = () => {
  return (
    <Container className="px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom">Columns with icons</h2>
      <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#collection"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Featured title</h3>
          <p>
            Paragraph of text beneath the heading to explain the heading. We'll add onto it with 
            another sentence and probably just keep going until we run out of words.
          </p>
          <a href="#" className="icon-link">
            Call to action
            <svg className="bi" aria-hidden="true">
              <use xlinkHref="#chevron-right"></use>
            </svg>
          </a>
        </Col>

        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#people-circle"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Featured title</h3>
          <p>
            Paragraph of text beneath the heading to explain the heading. We'll add onto it with 
            another sentence and probably just keep going until we run out of words.
          </p>
          <a href="#" className="icon-link">
            Call to action
            <svg className="bi" aria-hidden="true">
              <use xlinkHref="#chevron-right"></use>
            </svg>
          </a>
        </Col>

        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#toggles2"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Featured title</h3>
          <p>
            Paragraph of text beneath the heading to explain the heading. We'll add onto it with 
            another sentence and probably just keep going until we run out of words.
          </p>
          <a href="#" className="icon-link">
            Call to action
            <svg className="bi" aria-hidden="true">
              <use xlinkHref="#chevron-right"></use>
            </svg>
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Features;