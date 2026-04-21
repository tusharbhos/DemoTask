import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/common/Spinner';

const StateFormPage = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);

  const [form, setForm]         = useState({ state_name: '', status: 'Active' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchState = async () => {
      try {
        const res = await axiosInstance.get(`/states/${id}`);
        const { state_name, status } = res.data.data;
        setForm({ state_name, status });
      } catch {
        setApiError('Failed to load state data');
      } finally {
        setFetching(false);
      }
    };
    fetchState();
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.state_name.trim()) {
      newErrors.state_name = 'State name is required';
    } else if (form.state_name.trim().length < 2) {
      newErrors.state_name = 'State name must be at least 2 characters';
    } else if (form.state_name.trim().length > 100) {
      newErrors.state_name = 'State name must not exceed 100 characters';
    }
    if (!form.status) {
      newErrors.status = 'Status is required';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      if (isEdit) {
        await axiosInstance.put(`/states/${id}`, form);
      } else {
        await axiosInstance.post('/states', form);
      }
      navigate('/states', { state: { success: `State ${isEdit ? 'updated' : 'created'} successfully` } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setApiError(data?.message || 'Operation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="d-flex justify-content-center py-5">
      <Spinner text="Loading state..." />
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h4>{isEdit ? 'Edit State' : 'Add New State'}</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Location</li>
              <li
                className="breadcrumb-item"
                style={{ cursor: 'pointer', color: '#7b1fa2' }}
                onClick={() => navigate('/states')}
              >
                States
              </li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/states')}
        >
          ← Back to List
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card">
            <div className="card-header d-flex align-items-center gap-2">
              <span>{isEdit ? '✏️' : '➕'}</span>
              <h5>{isEdit ? 'Edit State' : 'Create New State'}</h5>
            </div>
            <div className="card-body">
              {apiError && (
                <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
                  <span>⚠️</span>
                  <span style={{ fontSize: '0.875rem' }}>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* State Name */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="state_name">
                    State Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="state_name"
                    name="state_name"
                    className={`form-control ${errors.state_name ? 'is-invalid' : ''}`}
                    placeholder="e.g., Maharashtra"
                    value={form.state_name}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {errors.state_name && (
                    <div className="invalid-feedback">{errors.state_name}</div>
                  )}
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label" htmlFor="status">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-gradient-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEdit ? 'Update State' : 'Create State'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/states')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StateFormPage;
