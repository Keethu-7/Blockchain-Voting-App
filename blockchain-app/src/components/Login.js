import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/vote", { state: { voterId, password } });
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Voter ID" onChange={(e) => setVoterId(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;