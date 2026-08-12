import React, { useState, useEffect } from 'react';
import './WelcomeAnimation.css';
import logoImage from '../../images/rakun.jpg';

const WelcomeAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    const shouldPlay = sessionStorage.getItem('playAnimation');
    if (shouldPlay === 'true') {
      setIsVisible(true);
      sessionStorage.removeItem('playAnimation');
      
      // Start the exit animation after a short delay
      const outTimer = setTimeout(() => {
        setAnimateOut(true);
      }, 2000); 

      // Remove component completely from DOM after exit animation finishes
      const unmountTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); 
      
      return () => {
        clearTimeout(outTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`welcome-animation-overlay ${animateOut ? 'animate-out' : ''}`}>
      <div className="welcome-animation-content">
        <div className="welcome-logo-container">
          <img src={logoImage} alt="Logo" className="welcome-logo-image" />
        </div>
        <h1 className="welcome-title">Library System</h1>
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
