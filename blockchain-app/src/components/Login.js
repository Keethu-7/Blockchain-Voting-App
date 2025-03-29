import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // Import the new CSS file

const Login = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!voterId || !password) {
      setError("Please enter both Voter ID and Password.");
      return;
    }
    setError("");
    navigate("/vote", { state: { voterId, password } });
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="login-title">Login</h2>
        {error && <p className="error-text">{error}</p>}
        
        <input
          type="text"
          placeholder="Email"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <div className="links">
          
          <a href="/register" className="register-link">
            <strong>Not a user?</strong> Register now
          </a>
        </div>

        <button onClick={handleLogin} className="login-button">
          LOGIN
        </button>
      </div>

      {/* Image Section */}
      <div className="image-container">
        <img
          src={process.env.PUBLIC_URL + "/Loginpic.png"}
          alt="Secure Login"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
