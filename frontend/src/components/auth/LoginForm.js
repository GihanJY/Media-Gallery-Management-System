import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const {login, googleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const credentials = {
        email,
        password
      };

      const result = await login(credentials);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError(error.message || "Login failed");
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const result = await googleAuth(tokenId);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Google login failed");
      }
    } catch (err) {
      setError("Google login failed");
      console.error("Google login error:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="p-4 rounded shadow bg-white" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="d-flex justify-content-center mb-3">
          <img src="/logo.png" width="30" height="30" alt="Company Logo" />
        </div>
        <h1 className="fw-bold mb-3 fs-2">Login</h1>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>

          <hr className="my-4" />

          <h2 className="fs-5 fw-bold mb-3">Or login with</h2>

          <div className="d-flex justify-content-center mb-3">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed")}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;