import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
      <input 
        type="text" 
        placeholder="Voter ID" 
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;