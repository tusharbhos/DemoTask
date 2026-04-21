import React from 'react';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel, loading }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-600" style={{ fontSize: '1rem' }}>
                {title || 'Confirm Action'}
              </h5>
              <button
                type="button"
                className="btn-close btn-sm"
                onClick={onCancel}
                disabled={loading}
              />
            </div>
            <div className="modal-body py-2">
              <p className="mb-0" style={{ fontSize: '0.875rem', color: '#495057' }}>
                {message || 'Are you sure you want to proceed?'}
              </p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                className="btn btn-sm btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
