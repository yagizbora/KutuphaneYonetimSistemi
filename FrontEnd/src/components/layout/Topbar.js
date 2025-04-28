import React from 'react';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-container">
        <h1 className="welcome-text">Welcome to Library System</h1>
        <div className="topbar-right">
          {/* <div className="notifications">
            <i className="fas fa-bell"></i>
          </div> */}
          <div className="user-profile">
            <i className="fas fa-user-circle"></i>
            User Settings
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar; 