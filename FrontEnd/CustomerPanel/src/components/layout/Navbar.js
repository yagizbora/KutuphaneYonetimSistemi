import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = ({ isOpen, toggleNavbar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/', icon: 'fas fa-home', text: t('home') },
    { path: '/dashboard', text: t('dashboard'), icon: 'fas fa-chart-line' },
    {
      text: t('book_operations'),
      icon: 'fas fa-book',
      items: [
        { path: '/customer-book', text: t('books'), icon: 'fas fa-address-book' },
      ],
    },
    {
      text: t('libraries'),
      icon: 'fas fa-university',
      items: [
        { path: '/library', text: t('libraries'), icon: 'fas fa-plus' },
      ]
    }
  ];

  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const renderMenuItem = (item, index) => {
    if (item.items) {
      const isActive = activeDropdown === index;
      const isChildActive = item.items.some(sub => location.pathname === sub.path);
      return (
        <li className="nav-item-container" key={index}>
          <div
            className={`nav-link ${isActive || isChildActive ? 'active' : ''}`}
            onClick={() => handleDropdownClick(index)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <i className={item.icon}></i>
              {!(!isOpen && !isMobile) && <span>{item.text}</span>}
            </div>
            {!(!isOpen && !isMobile) && <i className={`fas fa-chevron-${isActive ? 'up' : 'down'} text-xs opacity-50`}></i>}
          </div>
          {isActive && !(!isOpen && !isMobile) && (
            <div className="submenu" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '40px', marginTop: '8px', gap: '8px' }}>
              {item.items.map(subItem => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`submenu-link ${location.pathname === subItem.path ? 'active-sub' : ''}`}
                  style={{ textDecoration: 'none', color: location.pathname === subItem.path ? 'var(--primary-color)' : 'var(--text-muted)', fontSize: '14px', fontWeight: location.pathname === subItem.path ? '600' : '400' }}
                >
                  {subItem.text}
                </Link>
              ))}
            </div>
          )}
        </li>
      );
    }

    return (
      <li key={index}>
        <Link
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <i className={item.icon}></i>
          {!(!isOpen && !isMobile) && <span>{item.text}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div className={`sidebar-nav ${!isOpen ? 'collapsed' : ''}`}>
      <div className="navbar-brand">
        <div className="navbar-header">
          <i className="fas fa-layer-group"></i>
          {isOpen && <span>CustomerSys</span>}
        </div>
      </div>
      
      {!isMobile && (
        <button className="navbar-toggle" onClick={toggleNavbar}>
          <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
        </button>
      )}

      <ul className="nav-menu" style={{ overflowY: 'auto', paddingBottom: '30px' }}>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </ul>
    </div>
  );
};

export default Navbar;
