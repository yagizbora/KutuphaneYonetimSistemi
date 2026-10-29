import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="dashboard" 
      style={{ 
        position: 'relative', 
        minHeight: 'calc(100dvh - var(--topbar-height) - 96px)',
        height: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/library_background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }}
      />
      <div 
        style={{
          position: 'relative',
          minHeight: 'calc(100dvh - var(--topbar-height) - 96px)',
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.25))',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '1.5rem'
        }}
      >
        <h1 className="home-title"> BORA </h1>
        <h1 className="home-title">
          {t('welcome')}
        </h1>
        <p className="home-subtitle">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
};

export default Home;
