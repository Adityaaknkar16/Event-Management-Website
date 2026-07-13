import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { Trash2, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Failed to load enquiries', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/enquiries/${id}`, { isResolved: newStatus });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, isResolved: newStatus } : e));
    } catch (err) {
      console.error('Failed to update enquiry status', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the enquiry from "${name}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e._id !== id));
    } catch (err) {
      console.error('Failed to delete enquiry', err);
      alert(err.response?.data?.message || 'Failed to delete enquiry.');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="manage-enquiries">
      <div className="admin-section-header">
        <div>
          <h3>Manage Client Enquiries</h3>
          <p>Read messages submitted via the contact form and track their resolution status.</p>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <p className="no-data">No enquiries received yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry._id} className={enquiry.isResolved ? 'row-resolved' : 'row-unresolved'}>
                  <td>
                    <strong>{enquiry.name}</strong>
                    <span className="subtext-detail"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />{enquiry.email}</span>
                    <span className="subtext-detail"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />{enquiry.phone}</span>
                  </td>
                  <td>
                    <p className="message-cell-content">{enquiry.message}</p>
                  </td>
                  <td>
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleResolveStatus(enquiry._id, enquiry.isResolved)}
                      className={`resolve-toggle-btn ${enquiry.isResolved ? 'resolved' : 'unresolved'}`}
                      title={enquiry.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                    >
                      {enquiry.isResolved ? (
                        <>
                          <CheckCircle size={16} /> <span>Resolved</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} /> <span>Open</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(enquiry._id, enquiry.name)}
                      className="action-btn delete-btn"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={16} />
                    </button>
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

export default ManageEnquiries;
