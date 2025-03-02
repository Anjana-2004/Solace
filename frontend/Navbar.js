// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Optional: if you have CSS for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Solace</div>
      <ul className="nav-links">
        <li>
          <NavLink to="/" end activeclassname="active">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/chatbot" activeclassname="active">
            Chatbot
          </NavLink>
        </li>
        <li>
          <NavLink to="/quiz" activeclassname="active">
            Quiz
          </NavLink>
        </li>
        <li>
          <NavLink to="/sleep-schedule" activeclassname="active">
            Sleep Schedule
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeclassname="active">
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" activeclassname="active">
            Contact Us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
