import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = ({ isOpen, toggleNavbar }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      path: '/',
      icon: 'fas fa-home',
      text: 'Dashboard'
    },
    {
      text: 'Kitaplar',
      icon: 'fas fa-book',
      items: [
        { path: '/book', text: 'Kitap Listesi' },
        { path: '/book/categories', text: 'Kategoriler' }
      ]
    },
    {
      text: 'İşlemler',
      icon: 'fas fa-exchange-alt',
      items: [
        { path: '/lending-book', text: 'Ödünç Verme' },
        { path: '/book/return-book', text: 'Geri Alma' }
      ]
    },
    {
      text: 'Üyeler',
      icon: 'fas fa-users',
      items: [
        { path: '/user', text: 'Üye Listesi' },
      ]
    },
    {
      text: 'Loglar',
      icon: 'fas fa-history',
      items: [
        {
          path: '/logs/payment-logs', text: 'Ödeme Logları'
        }
      ]
    }
  ];

  const handleDropdownClick = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const renderMenuItem = (item, index) => {
    if (item.items) {
      return (
        <div className="nav-item-container" key={item.text}>
          <div
            className={`nav-item ${activeDropdown === index ? 'active' : ''}`}
            onClick={() => handleDropdownClick(index)}
          >
            <i className={item.icon}></i>
            <span className={`nav-text ${!isOpen ? 'hidden' : ''}`}>
              {item.text}
            </span>
          </div>
          <div className={`submenu ${activeDropdown === index ? 'show' : ''}`}>
            {item.items.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                className={`submenu-item ${location.pathname === subItem.path ? 'active' : ''}`}
              >
                {subItem.text}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
      >
        <i className={item.icon}></i>
        <span className={`nav-text ${!isOpen ? 'hidden' : ''}`}>
          {item.text}
        </span>
      </Link>
    );
  };

  return (
    <div className={`main-navbar ${!isOpen ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="navbar-content">
        {!isMobile && (
          <>
            <div className="navbar-brand-container">
              <i className="fas fa-book-reader brand-icon"></i>
              <span className={`brand-text ${!isOpen ? 'hidden' : ''}`}>
                Library System
              </span>
            </div>

            <button
              className="toggle-button"
              onClick={toggleNavbar}
              aria-label="Toggle navigation"
            >
              <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
            </button>
          </>
        )}

        <nav className="nav-links">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar; 