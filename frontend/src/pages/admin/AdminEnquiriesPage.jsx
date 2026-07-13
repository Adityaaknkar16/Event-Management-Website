import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import StatusBadge from '../../components/shared/StatusBadge';
import { Trash2, CheckCircle, Mail, Phone, Clock, AlertCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshNotifications } = useOutletContext() || {};

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, isResolved) => {
    try {
      await api.put(`/enquiries/${id}`, { isResolved });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, isResolved } : e));
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to update resolution status', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete the enquiry from "${name}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e._id !== id));
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Failed to delete enquiry', err);
      alert(err.response?.data?.message || 'Failed to delete message.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="manage-enquiries">
      <div className="admin-section-header">
        <div>
          <h3>Client Enquiries Inbox</h3>
          <p>Read client contact form submissions and mark resolved queries.</p>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <p className="no-data">Inbox is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Enquiry Message</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr 
                  key={e._id} 
                  className={e.isResolved ? 'row-resolved' : 'row-unresolved'}
                  style={{
                    background: !e.isResolved ? 'rgba(201, 169, 97, 0.02)' : ''
                  }}
                >
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!e.isResolved && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--lux-gold)', boxShadow: '0 0 8px var(--lux-gold)' }} title="Unresolved" />
                        )}
                        {e.name}
                      </strong>
                      <span className="subtext-detail"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{e.email}</span>
                      <span className="subtext-detail"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{e.phone}</span>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontSize: '13px', color: 'var(--lux-text-dim)', maxWidth: '380px', wordBreak: 'break-word' }}>{e.message}</p>
                  </td>
                  <td>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <StatusBadge status={e.isResolved ? 'resolved' : 'pending'} />
                  </td>
                  <td>
                    <div className="table-action-buttons">
                      {!e.isResolved ? (
                        <button 
                          onClick={() => handleResolve(e._id, true)} 
                          className="action-btn" 
                          title="Mark Resolved"
                          style={{ borderColor: 'var(--lux-gold)', color: 'var(--lux-gold)' }}
                        >
                          <CheckCircle size={14} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleResolve(e._id, false)} 
                          className="action-btn" 
                          title="Re-open Enquiry"
                        >
                          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(e._id, e.name)} className="action-btn delete-btn" title="Delete Message">
                        <Trash2 size={14} />
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
  );
};

export default AdminEnquiriesPage;
