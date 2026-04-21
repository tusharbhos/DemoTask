import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="navbar-top">
      <div className="me-auto">
        <span className="navbar-brand-text">Admin Panel</span>
      </div>

      <div className="admin-info ms-auto">
        <div className="admin-avatar">{getInitials(admin?.name || 'A')}</div>
        <div className="me-3">
          <div className="admin-name">{admin?.name || 'Admin'}</div>
          <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>{admin?.email}</div>
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
