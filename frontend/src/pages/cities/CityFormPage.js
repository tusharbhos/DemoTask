import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/common/Spinner';

const CityFormPage = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEdit    = Boolean(id);

  const [form, setForm]           = useState({ state_id: '', city_name: '', status: 'Active' });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(isEdit);
  const [activeStates, setActiveStates] = useState([]);

  // Fetch active states for dropdown
  useEffect(() => {
    axiosInstance.get('/states/all-active')
      .then(res => setActiveStates(res.data.data || []))
      .catch(() => {});
  }, []);

  // Fetch city data if editing
  useEffect(() => {
    if (!isEdit) return;
    const fetchCity = async () => {
      try {
        const res = await axiosInstance.get(`/cities/${id}`);
        const { state_id, city_name, status } = res.data.data;
        setForm({ state_id: String(state_id), city_name, status });
      } catch {
        setApiError('Failed to load city data');
      } finally {
        setFetching(false);
      }
    };
    fetchCity();
  }, [id, isEdit]);

  const validate = () => {
    const newErrors = {};
    if (!form.state_id) {
      newErrors.state_id = 'Please select a state';
    }
    if (!form.city_name.trim()) {
      newErrors.city_name = 'City name is required';
    } else if (form.city_name.trim().length < 2) {
      newErrors.city_name = 'City name must be at least 2 characters';
    } else if (form.city_name.trim().length > 100) {
      newErrors.city_name = 'City name must not exceed 100 characters';
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
      const payload = { ...form, state_id: parseInt(form.state_id) };
      if (isEdit) {
        await axiosInstance.put(`/cities/${id}`, payload);
      } else {
        await axiosInstance.post('/cities', payload);
      }
      navigate('/cities');
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
      <Spinner text="Loading city..." />
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h4>{isEdit ? 'Edit City' : 'Add New City'}</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">Location</li>
              <li
                className="breadcrumb-item"
                style={{ cursor: 'pointer', color: '#7b1fa2' }}
                onClick={() => navigate('/cities')}
              >
                Cities
              </li>
              <li className="breadcrumb-item active">{isEdit ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate('/cities')}
        >
          ← Back to List
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card">
            <div className="card-header d-flex align-items-center gap-2">
              <span>{isEdit ? '✏️' : '➕'}</span>
              <h5>{isEdit ? 'Edit City' : 'Create New City'}</h5>
            </div>
            <div className="card-body">
              {apiError && (
                <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
                  <span>⚠️</span>
                  <span style={{ fontSize: '0.875rem' }}>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* State Dropdown */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="state_id">
                    State <span className="text-danger">*</span>
                  </label>
                  <select
                    id="state_id"
                    name="state_id"
                    className={`form-select ${errors.state_id ? 'is-invalid' : ''}`}
                    value={form.state_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select State --</option>
                    {activeStates.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                  {errors.state_id && (
                    <div className="invalid-feedback">{errors.state_id}</div>
                  )}
                  {activeStates.length === 0 && (
                    <div className="form-text text-warning">
                      ⚠️ No active states available.{' '}
                      <span
                        style={{ cursor: 'pointer', color: '#7b1fa2', textDecoration: 'underline' }}
                        onClick={() => navigate('/states/create')}
                      >
                        Create a state first
                      </span>
                    </div>
                  )}
                </div>

                {/* City Name */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="city_name">
                    City Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="city_name"
                    name="city_name"
                    className={`form-control ${errors.city_name ? 'is-invalid' : ''}`}
                    placeholder="e.g., Mumbai"
                    value={form.city_name}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {errors.city_name && (
                    <div className="invalid-feedback">{errors.city_name}</div>
                  )}
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label" htmlFor="city_status">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    id="city_status"
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
                      isEdit ? 'Update City' : 'Create City'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate('/cities')}
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

export default CityFormPage;
