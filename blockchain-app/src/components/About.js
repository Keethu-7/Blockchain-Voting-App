import React from "react";
import { Link } from "react-router-dom";
import "./styles/About.css"; // Import the CSS file

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 className="about-title">About</h2>
        <p>
          An online voting system that will replace the old ballot system or paper system. Over time, 
          we have utilized the required technology in every sector to improve efficiency and save extra resources. 
          But the voting system is still very expensive and requires a bigger workforce. The system is slower and 
          still not completely tamper-proof.
        </p>
        <p>
          We bring a system that is safe, reliable, and solves modern issues like higher reachability of the booth, 
          crowd-free voting, inexpensive, faster results, and others.
        </p>
        <Link to="/" className="back-button">🏠 Back to Home</Link>
      </div>
    </div>
  );
};

export default About;
