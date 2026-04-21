import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ states: 0, activeStates: 0, cities: 0, activeCities: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stateRes, cityRes] = await Promise.all([
          axiosInstance.get('/states?limit=1'),
          axiosInstance.get('/cities?limit=1'),
        ]);
        const [activeStateRes, activeCityRes] = await Promise.all([
          axiosInstance.get('/states?limit=1&status=Active'),
          axiosInstance.get('/cities?limit=1&status=Active'),
        ]);
        setStats({
          states:       stateRes.data.pagination?.total || 0,
          activeStates: activeStateRes.data.pagination?.total || 0,
          cities:       cityRes.data.pagination?.total || 0,
          activeCities: activeCityRes.data.pagination?.total || 0,
        });
      } catch {
        // Non-critical, silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total States',
      value: stats.states,
      icon: '🗺️',
      bg: 'rgba(123,31,162,0.1)',
      color: '#7b1fa2',
      action: () => navigate('/states'),
    },
    {
      label: 'Active States',
      value: stats.activeStates,
      icon: '✅',
      bg: 'rgba(40,167,69,0.1)',
      color: '#28a745',
      action: () => navigate('/states'),
    },
    {
      label: 'Total Cities',
      value: stats.cities,
      icon: '🏙️',
      bg: 'rgba(23,162,184,0.1)',
      color: '#17a2b8',
      action: () => navigate('/cities'),
    },
    {
      label: 'Active Cities',
      value: stats.activeCities,
      icon: '🌆',
      bg: 'rgba(255,193,7,0.1)',
      color: '#d39e00',
      action: () => navigate('/cities'),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h4>Dashboard</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Home</li>
            </ol>
          </nav>
        </div>
        <div>
          <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            Welcome back, <strong>{admin?.name}</strong> 👋
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((card, idx) => (
          <div className="col-sm-6 col-xl-3" key={idx}>
            <div
              className="stat-card card h-100"
              style={{ cursor: 'pointer' }}
              onClick={card.action}
            >
              <div className="card-body d-flex align-items-center gap-3 p-3">
                <div
                  className="stat-icon"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  {loading ? (
                    <div className="placeholder-glow">
                      <span className="placeholder col-4" />
                    </div>
                  ) : (
                    <div className="stat-value" style={{ color: card.color }}>
                      {card.value}
                    </div>
                  )}
                  <div className="stat-label">{card.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>📍 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-gradient-primary btn-sm"
                  onClick={() => navigate('/states/create')}
                >
                  + Add State
                </button>
                <button
                  className="btn btn-gradient-primary btn-sm"
                  onClick={() => navigate('/cities/create')}
                >
                  + Add City
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/states')}
                >
                  View States
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/cities')}
                >
                  View Cities
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>🌐 Public API</h5>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                Laravel public API endpoints for active locations:
              </p>
              <code style={{ fontSize: '0.75rem', background: '#f8f9fa', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block', marginBottom: '0.35rem' }}>
                GET /api/locations
              </code>
              <code style={{ fontSize: '0.75rem', background: '#f8f9fa', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block', marginBottom: '0.35rem' }}>
                GET /api/locations/states
              </code>
              <code style={{ fontSize: '0.75rem', background: '#f8f9fa', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'block' }}>
                GET /api/locations/states/{'{id}'}/cities
              </code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
