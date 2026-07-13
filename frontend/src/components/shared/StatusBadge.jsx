import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (String(status).toLowerCase()) {
      case 'pending':
      case 'false':
      case 'open':
        return 'status-badge pending';
      case 'confirmed':
      case 'true':
      case 'resolved':
      case 'approved':
        return 'status-badge confirmed';
      case 'rejected':
        return 'status-badge rejected';
      case 'completed':
        return 'status-badge completed';
      default:
        return 'status-badge completed';
    }
  };

  const getLabel = () => {
    if (status === true || status === 'true' || status === 'approved' || status === 'resolved') {
      return status === 'resolved' ? 'Resolved' : 'Approved';
    }
    if (status === false || status === 'false' || status === 'unresolved') {
      return 'Pending';
    }
    return String(status).toUpperCase();
  };

  return (
    <span className={getBadgeClass()}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
