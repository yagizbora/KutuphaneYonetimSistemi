import React from 'react';

const Home = () => {
  return (
    <div 
      className="dashboard" 
      style={{ 
        position: 'relative', 
        height: 'calc(100vh - var(--topbar-height) - 64px)', 
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/library_background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.2))',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          Kütüphane Yönetim Sistemine Hoş Geldiniz
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Modern ve sezgisel panelimiz ile kitaplarınızı, üyelerinizi ve kütüphane operasyonlarınızı kolayca yönetin.
        </p>
      </div>
    </div>
  );
};

export default Home;
