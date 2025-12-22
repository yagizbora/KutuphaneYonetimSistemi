import React,{useState,useEffect} from 'react';


const Footer = ({version}) => {

  return (
    <footer className="footer">
      <div>© 2025 Library Management System. All rights reserved.</div>
      <div>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact Us</a>
        {version && <a className="version-info">Version: {version}</a>}
      </div>
    </footer>
  );
};

export default Footer; 