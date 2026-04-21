import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useDebounce } from '../../hooks/useDebounce';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Spinner from '../../components/common/Spinner';

const StateList = () => {
  const navigate = useNavigate();

  const [states, setStates]         = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]       = useState(true);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]   = useState('');
  const [successMsg, setSuccessMsg]     = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const fetchStates = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        search: debouncedSearch,
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await axiosInstance.get(`/states?${params}`);
      setStates(res.data.data || []);
      setPagination(prev => ({ ...prev, ...res.data.pagination, page }));
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, pagination.limit]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStates(1);
  }, [debouncedSearch, statusFilter]); // eslint-disable-line

  const handlePageChange = (page) => {
    fetchStates(page);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axiosInstance.delete(`/states/${deleteId}`);
      setDeleteId(null);
      setSuccessMsg('State deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchStates(pagination.page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete state';
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h4>States Management</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Location</li>
              <li className="breadcrumb-item active">States</li>
            </ol>
          </nav>
        </div>
        <button
          className="btn btn-gradient-primary btn-sm px-3"
          onClick={() => navigate('/states/create')}
        >
          + Add State
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
            placeholder="Search states..."
          />
          <div className="d-flex align-items-center gap-2">
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
          ) : states.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem' }}>🗺️</div>
              <p className="text-muted mt-2">No states found</p>
              <button
                className="btn btn-gradient-primary btn-sm"
                onClick={() => navigate('/states/create')}
              >
                Add First State
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>State Name</th>
                    <th>Status</th>
                    <th>Cities</th>
                    <th>Created</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((state, idx) => (
                    <tr key={state.id}>
                      <td className="text-muted">
                        {(pagination.page - 1) * pagination.limit + idx + 1}
                      </td>
                      <td className="fw-500">{state.state_name}</td>
                      <td><StatusBadge status={state.status} /></td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(123,31,162,0.1)',
                            color: '#7b1fa2',
                            cursor: 'pointer',
                          }}
                          onClick={() => navigate(`/cities?state_id=${state.id}`)}
                          title="View cities"
                        >
                          {state.city_count} cities
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: '#6c757d' }}>
                        {new Date(state.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => navigate(`/states/${state.id}/edit`)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => { setDeleteId(state.id); setDeleteError(''); }}
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
        {!loading && states.length > 0 && (
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
        title="Delete State"
        message="Are you sure you want to delete this state? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteError(''); }}
        loading={deleteLoading}
      />
    </>
  );
};

export default StateList;
