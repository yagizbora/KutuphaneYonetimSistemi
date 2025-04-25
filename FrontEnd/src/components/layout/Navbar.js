import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = ({ isOpen, toggleNavbar }) => {
  const location = useLocation();

  const menuItems = [
    {
      type: 'link',
      path: '/',
      icon: 'fas fa-home',
      text: 'Dashboard'
    },
    {
      type: 'dropdown',
      text: 'Kitaplar',
      icon: 'fas fa-book-open',
      items: [
        {
          path: '/book',
          icon: 'fas fa-list',
          text: 'Kitap Listesi'
        },
        {
          path: '/lending-book',
          icon: 'fas fa-hand-holding',
          text: 'Ödünç Verme'
        },
        {
          path: '/book/return',
          icon: 'fas fa-undo',
          text: 'Geri Alma'
        }
      ]
    },
    {
      type: 'link',
      path: '/members',
      icon: 'fas fa-users',
      text: 'Members'
    }
  ];

  const renderMenuItem = (item) => {
    if (item.type === 'link') {
      return (
        <Nav.Link 
          key={item.path}
          as={Link} 
          to={item.path} 
          className={`text-white py-3 ${location.pathname === item.path ? 'active bg-primary-dark' : ''}`}
        >
          <div className="d-flex align-items-center px-3">
            <i className={`${item.icon} fa-lg`}></i>
            {isOpen && <span className="ms-3">{item.text}</span>}
          </div>
        </Nav.Link>
      );
    }

    if (item.type === 'dropdown') {
      return (
        <div key={item.text} className={`nav-item ${!isOpen ? 'dropdown-collapsed' : ''}`}>
          <NavDropdown
            title={
              <div className="d-flex align-items-center px-3 text-white">
                <i className={`${item.icon} fa-lg`}></i>
                {isOpen && <span className="ms-3">{item.text}</span>}
              </div>
            }
            id={`${item.text.toLowerCase()}-dropdown`}
            className={`text-white ${item.items.some(subItem => location.pathname.startsWith(subItem.path)) ? 'active' : ''}`}
          >
            {item.items.map(subItem => (
              <NavDropdown.Item 
                key={subItem.path}
                as={Link} 
                to={subItem.path} 
                className={location.pathname === subItem.path ? 'active' : ''}
              >
                <i className={`${subItem.icon} me-2`}></i>
                {subItem.text}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </div>
      );
    }
  };

  return (
    <BootstrapNavbar 
      className={`flex-column bg-primary text-white ${!isOpen ? 'navbar-collapsed' : ''}`}
      style={{ minHeight: '100vh', width: isOpen ? '250px' : '80px' }}
    >
      <BootstrapNavbar.Brand className="text-white w-100 py-3">
        <div className="d-flex align-items-center justify-content-center px-3">
          <i className="fas fa-book-reader fa-lg"></i>
          {isOpen && <span className="ms-3">Library System</span>}
        </div>
      </BootstrapNavbar.Brand>
      
      <button 
        className="navbar-toggle btn btn-primary border-0"
        onClick={toggleNavbar}
        style={{ position: 'absolute', right: '-15px', top: '20px' }}
      >
        <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
      </button>

      <Nav className="flex-column w-100 mt-3">
        {menuItems.map(item => renderMenuItem(item))}
      </Nav>
    </BootstrapNavbar>
  );
};

export default Navbar; 