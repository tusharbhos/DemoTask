import React from 'react';

const StatusBadge = ({ status }) => {
  if (status === 'Active') {
    return <span className="badge-active">● Active</span>;
  }
  return <span className="badge-inactive">● Inactive</span>;
};

export default StatusBadge;
