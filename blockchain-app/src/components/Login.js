import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform authentication if needed
    navigate("/voting"); // Redirect to voting page
  };

  return (
    <div className="login-container">
      <h2>Login to E-Voting</h2>
      <button onClick={handleLogin}>Login with MetaMask</button>
    </div>
  );
};

export default Login;
