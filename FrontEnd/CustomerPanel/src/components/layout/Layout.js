import React from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import Footer from './Footer';

const Layout = ({ children, isNavbarOpen, toggleNavbar, version }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="layout">
      {isMobile && isNavbarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleNavbar}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
      <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
      <div className={`layout-content ${!isNavbarOpen ? 'content-expanded' : ''}`}>
        <Topbar toggleNavbar={toggleNavbar} isNavbarOpen={isNavbarOpen} />
        <main className="main-content">
          {children}
        </main>
        <Footer version={version} />
      </div>
    </div>
  );
};

export default Layout; 