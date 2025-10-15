import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sample data - replace with real data from your API
  const stats = {
    totalMedia: 1,
    photos: 0,
    videos: 0,
    storage: '0 GB'
  };

  const recentMedia = [
    { id: 1, name: 'Summer Vacation 2024', type: 'Album', items: 45, date: '2024-10-10', thumbnail: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product Photoshoot', type: 'Album', items: 23, date: '2024-10-08', thumbnail: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Client Meeting', type: 'Video', items: 1, date: '2024-10-05', thumbnail: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Team Building Event', type: 'Album', items: 67, date: '2024-10-01', thumbnail: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <Container fluid className="px-4">
          <span className="navbar-brand mb-0 h1">Media Gallery</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Welcome, {user?.name || 'User'}</span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </nav>

      <Container fluid className="px-4 py-4">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Total Media</p>
                    <h3 className="mb-0">{stats.totalMedia}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <svg width="24" height="24" fill="currentColor" className="text-primary">
                      <path d="M4 4h16v12H4z M6 16h12v2H6z"/>
                    </svg>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Photos</p>
                    <h3 className="mb-0">{stats.photos}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <svg width="24" height="24" fill="currentColor" className="text-success">
                      <path d="M3 3h18v18H3z M8 10l3 4 5-6"/>
                    </svg>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Videos</p>
                    <h3 className="mb-0">{stats.videos}</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <svg width="24" height="24" fill="currentColor" className="text-info">
                      <path d="M4 4h12v12H4z M16 8l4-2v8l-4-2z"/>
                    </svg>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">Storage Used</p>
                    <h3 className="mb-0">{stats.storage}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <svg width="24" height="24" fill="currentColor" className="text-warning">
                      <path d="M4 6h16v12H4z M8 2h8v4H8z"/>
                    </svg>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          <Col lg={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">My Media</h5>
                  <Button variant="primary" size="sm">
                    <span className="me-2">+</span>
                    Upload New
                  </Button>
                </div>

                {/* Tabs */}
                <Nav variant="tabs" className="mb-4">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'all'} 
                      onClick={() => setActiveTab('all')}
                      className="cursor-pointer"
                    >
                      All Media
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'photos'} 
                      onClick={() => setActiveTab('photos')}
                      className="cursor-pointer"
                    >
                      Photos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'videos'} 
                      onClick={() => setActiveTab('videos')}
                      className="cursor-pointer"
                    >
                      Videos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'albums'} 
                      onClick={() => setActiveTab('albums')}
                      className="cursor-pointer"
                    >
                      Albums
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* Search Bar */}
                <Form.Control 
                  type="search" 
                  placeholder="Search your media..." 
                  className="mb-4"
                />

                {/* Media Grid */}
                <Row>
                  {recentMedia.map((item) => (
                    <Col md={6} lg={3} key={item.id} className="mb-4">
                      <Card className="border-0 shadow-sm h-100 hover-shadow transition">
                        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                          <Card.Img 
                            variant="top" 
                            src={item.thumbnail} 
                            style={{ height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Card.Title className="h6 mb-0">{item.name}</Card.Title>
                            <Badge bg="secondary" className="ms-2">{item.type}</Badge>
                          </div>
                          <Card.Text className="text-muted small mb-2">
                            {item.items} {item.items === 1 ? 'item' : 'items'}
                          </Card.Text>
                          <Card.Text className="text-muted small">
                            {new Date(item.date).toLocaleDateString()}
                          </Card.Text>
                          <div className="d-flex gap-2 mt-3">
                            <Button variant="outline-primary" size="sm" className="flex-grow-1">
                              View
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              Share
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Empty State (show when no media) */}
                {recentMedia.length === 0 && (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <svg width="64" height="64" fill="currentColor" className="text-muted">
                        <path d="M8 8h48v48H8z M20 24l12 16 20-24"/>
                      </svg>
                    </div>
                    <h5 className="text-muted">No media yet</h5>
                    <p className="text-muted">Upload your first photo or video to get started</p>
                    <Button variant="primary" className="mt-2">
                      Upload Media
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          cursor: pointer;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;