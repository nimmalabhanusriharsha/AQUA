import React from 'react';
import { getAdminSession } from '../utils/adminAuth';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="layout-container" style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <AdminSidebar />
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
