import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = { name, email, password };
      const result = await register(user);
      if (result) {
        console.log(result);
        if (result.success) {
          navigate("/register/verify", { state: { email } });
        }
        else {
          setError(result.message);
        }
      }
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  return (
    <div className="-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="p-4 rounded shadow bg-white"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-center mb-3">
          <img src="/logo.png" width="30" height="30" alt="Company Logo" />
        </div>
        <h1 className="fw-bold mb-3 fs-2">Sign up for free</h1>
        <p>{error}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
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
            Sign up
          </Button>

          <p className="text-muted small">
            By clicking Sign up, you agree to the terms of use.
          </p>

          <hr className="my-4" />

          <h2 className="fs-5 fw-bold mb-3">Or use a third-party</h2>

          <GoogleLogin onSuccess={(credentialResponse)=> {console.log(credentialResponse);}} onError={()=> {console.log("Login failed")}}
            />
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;
