import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useDebounce } from '../../hooks/useDebounce';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Spinner from '../../components/common/Spinner';

const CityList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cities, setCities]         = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [search, setSearch]         = useState('');
  const [stateFilter, setStateFilter]   = useState(searchParams.get('state_id') || '');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeStates, setActiveStates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [deleteId, setDeleteId]         = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]   = useState('');
  const [successMsg, setSuccessMsg]     = useState('');

  const debouncedSearch = useDebounce(search, 400);

  // Fetch states for filter dropdown
  useEffect(() => {
    axiosInstance.get('/states/all-active')
      .then(res => setActiveStates(res.data.data || []))
      .catch(() => {});
  }, []);

  const fetchCities = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        ...(stateFilter && { state_id: stateFilter }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await axiosInstance.get(`/cities?${params}`);
      setCities(res.data.data || []);
      setPagination(prev => ({ ...prev, ...res.data.pagination, page }));
    } catch {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, stateFilter, statusFilter, pagination.limit]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCities(1);
  }, [debouncedSearch, stateFilter, statusFilter]); // eslint-disable-line

  const handlePageChange = (page) => fetchCities(page);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axiosInstance.delete(`/cities/${deleteId}`);
      setDeleteId(null);
      setSuccessMsg('City deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchCities(pagination.page);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete city');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h4>Cities Management</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Location</li>
              <li className="breadcrumb-item active">Cities</li>
            </ol>
          </nav>
        </div>
        <button
          className="btn btn-gradient-primary btn-sm px-3"
          onClick={() => navigate('/cities/create')}
        >
          + Add City
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="alert alert-success py-2 d-flex justify-content-between align-items-center">
          <span>✅ {successMsg}</span>
          <button className="btn-close btn-sm" onClick={() => setSuccessMsg('')} />
        </div>
      )}
      {deleteError && (
        <div className="alert alert-danger py-2 d-flex justify-content-between align-items-center">
          <span>⚠️ {deleteError}</span>
          <button className="btn-close btn-sm" onClick={() => setDeleteError('')} />
        </div>
      )}

      {/* Table Card */}
      <div className="card table-card">
        {/* Filters */}
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search cities..."
          />
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
            >
              <option value="">All States</option>
              {activeStates.map(s => (
                <option key={s.id} value={s.id}>{s.state_name}</option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span style={{ fontSize: '0.8125rem', color: '#6c757d', whiteSpace: 'nowrap' }}>
              {pagination.total} records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          {loading ? (
            <Spinner />
          ) : cities.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem' }}>🏙️</div>
              <p className="text-muted mt-2">No cities found</p>
              <button
                className="btn btn-gradient-primary btn-sm"
                onClick={() => navigate('/cities/create')}
              >
                Add First City
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>City Name</th>
                    <th>State</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city, idx) => (
                    <tr key={city.id}>
                      <td className="text-muted">
                        {(pagination.page - 1) * pagination.limit + idx + 1}
                      </td>
                      <td className="fw-500">{city.city_name}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            color: '#7b1fa2',
                            cursor: 'pointer',
                          }}
                          onClick={() => setStateFilter(String(city.state_id))}
                        >
                          {city.state_name}
                        </span>
                      </td>
                      <td><StatusBadge status={city.status} /></td>
                      <td style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
                        {new Date(city.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => navigate(`/cities/${city.id}/edit`)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => { setDeleteId(city.id); setDeleteError(''); }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && cities.length > 0 && (
          <div className="card-footer bg-transparent">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        show={!!deleteId}
        title="Delete City"
        message="Are you sure you want to delete this city? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteError(''); }}
        loading={deleteLoading}
      />
    </>
  );
};

export default CityList;
