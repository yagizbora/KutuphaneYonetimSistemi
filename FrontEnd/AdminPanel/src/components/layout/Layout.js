import React from 'react';
import Navbar from './Navbar';
import Topbar from './Topbar';
import Footer from './Footer';

const Layout = ({ children, isNavbarOpen, toggleNavbar, version }) => {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 900);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 899.98px)');
    const handleMediaChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  React.useEffect(() => {
    if (isMobile && isNavbarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isNavbarOpen]);

  return (
    <div className="layout">
      {isMobile && isNavbarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleNavbar}
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
