import React from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import Footer from './Footer';

const Layout = ({ children, isNavbarOpen, toggleNavbar }) => {
  return (
    <div className="layout">
      <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
      <div className={`layout-content ${!isNavbarOpen ? 'content-expanded' : ''}`}>
        <Topbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 