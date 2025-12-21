import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white" 
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 fixed h-full border-r border-gray-200 bg-white">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;