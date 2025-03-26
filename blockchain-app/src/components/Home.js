import React from 'react';
import { Link } from 'react-router-dom';
import  './styles/Home.css'

const Home = () => {
  return (
    <div >
      {/* Navbar */}
      <nav>
        <Link to="/about" >About</Link>
        <Link to="/contact" >Contact</Link>
      </nav>

      {/* Heading */}
      <h2 >Be a part of decision</h2>
      <h1 >Vote Today</h1>

      {/* Buttons */}
      <div className="buttons">
        <Link to="/register">
          <button>
            REGISTER
          </button>
        </Link>
        <Link to="/login">
          <button >
            LOGIN
          </button>
        </Link>
        <Link to='/admin'>
          <button> ADMIN LOGIN </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
