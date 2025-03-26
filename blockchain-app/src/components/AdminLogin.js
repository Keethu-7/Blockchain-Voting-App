// src/components/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const adminPassword = "admin123"; // Temporary for testing

  const handleLogin = () => {
    if (password === adminPassword) {
      navigate("/admin-dashboard");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
