import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Features = () => {
  return (
    <Container className="px-4 py-5" id="features">
      <h2 className="pb-2 border-bottom">Powerful Features for Your Media</h2>
      <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3" style={{width: '4rem', height: '4rem', borderRadius: '0.5rem'}}>
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#collection"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Smart Organization</h3>
          <p>
            Automatically organize your photos and videos with intelligent tagging, 
            albums, and collections. Find any file in seconds with our powerful search 
            and filtering capabilities.
          </p>
          <a href="#" className="icon-link">
            Learn more
            <svg className="bi" aria-hidden="true">
              <use xlinkHref="#chevron-right"></use>
            </svg>
          </a>
        </Col>

        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3" style={{width: '4rem', height: '4rem', borderRadius: '0.5rem'}}>
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#people-circle"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Secure Sharing</h3>
          <p>
            Share your galleries with clients, team members, or friends with customizable 
            privacy controls. Create password-protected albums and control who can view, 
            download, or comment on your media.
          </p>
          <a href="#" className="icon-link">
            Explore sharing
            <svg className="bi" aria-hidden="true">
              <use xlinkHref="#chevron-right"></use>
            </svg>
          </a>
        </Col>

        <Col className="feature">
          <div className="feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3" style={{width: '4rem', height: '4rem', borderRadius: '0.5rem'}}>
            <svg className="bi" width="1em" height="1em" aria-hidden="true">
              <use xlinkHref="#toggles2"></use>
            </svg>
          </div>
          <h3 className="fs-2 text-body-emphasis">Cloud Storage</h3>
          <p>
            Access your entire media library from anywhere with secure cloud storage. 
            Automatic backups ensure your precious memories are always safe, with unlimited 
            storage options for growing collections.
          </p>
          <a href="#" className="icon-link">
            View plans
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