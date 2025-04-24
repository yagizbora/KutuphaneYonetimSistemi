import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isOpen, toggleNavbar }) => {
  const location = useLocation();

  return (
    <nav className={`navbar ${!isOpen ? 'navbar-collapsed' : ''}`}>
      <div className="navbar-brand">
        <div className="navbar-header">
          <i className="fas fa-book-reader"></i>
          {isOpen && <span>Library System</span>}
        </div>
      </div>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
      </button>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/books" 
            className={`nav-link ${location.pathname === '/books' ? 'active' : ''}`}
          >
            <i className="fas fa-book-open"></i>
            {isOpen && <span>Books</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/members" 
            className={`nav-link ${location.pathname === '/members' ? 'active' : ''}`}
          >
            <i className="fas fa-users"></i>
            {isOpen && <span>Members</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 