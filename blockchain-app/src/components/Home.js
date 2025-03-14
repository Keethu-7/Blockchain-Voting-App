import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Blockchain E-Voting</h1>
      <Link to="/register">Register as Voter</Link> | 
      <Link to="/login">Login to Vote</Link>
    </div>
  );
};

export default Home;