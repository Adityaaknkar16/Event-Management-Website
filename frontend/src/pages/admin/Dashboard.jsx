import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { 
  Settings, 
  CalendarRange, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    servicesCount: 0,
    bookingsCount: 0,
    enquiriesCount: 0,
    pendingBookings: 0,
    unresolvedEnquiries: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [servicesRes, bookingsRes, enquiriesRes] = await Promise.all([
          api.get('/services/admin'),
          api.get('/bookings'),
          api.get('/enquiries'),
        ]);

        const services = servicesRes.data;
        const bookings = bookingsRes.data;
        const enquiries = enquiriesRes.data;

        setStats({
          servicesCount: services.length,
          bookingsCount: bookings.length,
          enquiriesCount: enquiries.length,
          pendingBookings: bookings.filter((b) => b.status === 'pending').length,
          unresolvedEnquiries: enquiries.filter((e) => !e.isResolved).length,
        });

        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard statistics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <div className="stats-grid-admin">
        {/* Card 1 */}
        <div className="admin-stat-card">
          <div className="card-header-admin">
            <span className="card-title-admin">Total Services</span>
            <Settings className="stat-card-icon" size={24} />
          </div>
          <div className="card-body-admin">
            <h3>{stats.servicesCount}</h3>
            <Link to="/admin/services" className="card-link-admin">Manage Services</Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="admin-stat-card">
          <div className="card-header-admin">
            <span className="card-title-admin">Bookings</span>
            <CalendarRange className="stat-card-icon" size={24} />
          </div>
          <div className="card-body-admin">
            <h3>{stats.bookingsCount}</h3>
            <p className="card-subtitle-admin">
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {stats.pendingBookings} pending approvals
            </p>
            <Link to="/admin/bookings" className="card-link-admin">View Requests</Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="admin-stat-card">
          <div className="card-header-admin">
            <span className="card-title-admin">Enquiries</span>
            <HelpCircle className="stat-card-icon" size={24} />
          </div>
          <div className="card-body-admin">
            <h3>{stats.enquiriesCount}</h3>
            <p className="card-subtitle-admin">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {stats.unresolvedEnquiries} unresolved questions
            </p>
            <Link to="/admin/enquiries" className="card-link-admin">Resolve Enquiries</Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="dashboard-table-card">
        <h3>Recent Booking Requests</h3>
        {recentBookings.length === 0 ? (
          <p className="no-data">No booking requests submitted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <strong>{b.customer?.name}</strong>
                      <span className="subtext-detail">{b.customer?.email}</span>
                    </td>
                    <td>{b.eventService?.title}</td>
                    <td>{new Date(b.eventDate).toLocaleDateString()}</td>
                    <td>{b.location}</td>
                    <td>
                      <span className={`status-badge ${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
