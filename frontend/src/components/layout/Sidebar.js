import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [locationOpen, setLocationOpen] = useState(
    location.pathname.startsWith('/states') || location.pathname.startsWith('/cities')
  );

  return (
    <nav className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">A</div>
        <div>
          <div className="sidebar-brand-text">Admin Panel</div>
          <span className="sidebar-brand-sub">Management System</span>
        </div>
      </div>

      {/* Navigation */}
      <ul className="sidebar-nav list-unstyled m-0">
        <li className="sidebar-nav-section">Main</li>

        {/* Dashboard */}
        <li className="sidebar-nav-item">
          <NavLink to="/dashboard" className={({ isActive }) =>
            `sidebar-nav-link ${isActive ? 'active' : ''}`
          }>
            <span className="nav-icon">📊</span>
            Dashboard
          </NavLink>
        </li>

        <li className="sidebar-nav-section">Location Management</li>

        {/* Location parent */}
        <li className="sidebar-nav-item">
          <button
            className={`sidebar-nav-link w-100 border-0 bg-transparent text-start ${
              locationOpen ? 'active' : ''
            }`}
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <span className="nav-icon">📍</span>
            Locations
            <span className={`nav-arrow ms-auto ${locationOpen ? 'rotate-90' : ''}`}>▶</span>
          </button>

          {locationOpen && (
            <ul className="sub-menu list-unstyled mb-1">
              <li>
                <NavLink
                  to="/states"
                  className={({ isActive }) =>
                    `sub-menu-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span>🗺️</span> States
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cities"
                  className={({ isActive }) =>
                    `sub-menu-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span>🏙️</span> Cities
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
