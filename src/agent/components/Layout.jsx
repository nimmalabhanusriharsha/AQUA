import React from 'react';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="content-inner">
          {children}
        </div>
        <div className="mobile-nav-container">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default Layout;
