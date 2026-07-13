import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { 
  Settings, 
  CalendarRange, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  ThumbsUp,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    servicesCount: 0,
    bookingsCount: 0,
    pendingBookings: 0,
    enquiriesCount: 0,
    unresolvedEnquiries: 0,
    pendingTestimonials: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [servicesRes, bookingsRes, enquiriesRes, testimonialsRes] = await Promise.all([
          api.get('/services/admin'),
          api.get('/bookings'),
          api.get('/enquiries'),
          api.get('/testimonials/admin'),
        ]);

        const services = servicesRes.data;
        const bookings = bookingsRes.data;
        const enquiries = enquiriesRes.data;
        const testimonials = testimonialsRes.data;

        setStats({
          servicesCount: services.length,
          bookingsCount: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          enquiriesCount: enquiries.length,
          unresolvedEnquiries: enquiries.filter(e => !e.isResolved).length,
          pendingTestimonials: testimonials.filter(t => !t.isApproved).length,
        });

        setRecentBookings(bookings.slice(0, 4));
        setRecentEnquiries(enquiries.slice(0, 4));

        // Generate data for Recharts (bookings over time by month)
        // Group by month/year based on eventDate
        const months = {};
        bookings.forEach(b => {
          try {
            const date = new Date(b.eventDate);
            const monthName = date.toLocaleString('default', { month: 'short' });
            months[monthName] = (months[monthName] || 0) + 1;
          } catch(e) {}
        });

        const formattedChartData = Object.keys(months).map(m => ({
          name: m,
          bookings: months[m]
        })).slice(-6); // Last 6 active months

        setChartData(formattedChartData.length > 0 ? formattedChartData : [
          { name: 'Jan', bookings: 2 },
          { name: 'Feb', bookings: 5 },
          { name: 'Mar', bookings: 8 },
          { name: 'Apr', bookings: 12 },
          { name: 'May', bookings: 10 },
          { name: 'Jun', bookings: 18 }
        ]);

      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-dashboard">
      <div className="stats-grid-admin">
        {/* Total Bookings */}
        <div className="admin-stat-card">
          <div className="card-header-admin">
            <span className="card-title-admin">Total Bookings</span>
            <CalendarRange className="stat-card-icon" size={24} />
          </div>
          <div className="card-body-admin">
            <h3>{stats.bookingsCount}</h3>
            <Link to="/admin/bookings" className="card-link-admin">View All Bookings</Link>
          </div>
        </div>

        {/* Pending Bookings (Highlighted Gold if > 0) */}
        <div className={`admin-stat-card ${stats.pendingBookings > 0 ? 'highlighted-gold-card' : ''}`} style={{
          border: stats.pendingBookings > 0 ? '1px solid var(--lux-gold)' : '1px solid var(--border-color)',
          background: stats.pendingBookings > 0 ? 'var(--lux-gold-glow)' : 'var(--bg-secondary)'
        }}>
          <div className="card-header-admin">
            <span className="card-title-admin" style={{ color: stats.pendingBookings > 0 ? 'var(--lux-gold)' : '' }}>Pending Approval</span>
            <Clock className="stat-card-icon" size={24} style={{ color: stats.pendingBookings > 0 ? 'var(--lux-gold)' : '' }} />
          </div>
          <div className="card-body-admin">
            <h3 style={{ color: stats.pendingBookings > 0 ? 'var(--lux-gold)' : '' }}>{stats.pendingBookings}</h3>
            <Link to="/admin/bookings?filter=pending" className="card-link-admin" style={{ color: stats.pendingBookings > 0 ? 'var(--lux-gold)' : '' }}>Review Requests</Link>
          </div>
        </div>

        {/* Unresolved Enquiries */}
        <div className="admin-stat-card" style={{
          border: stats.unresolvedEnquiries > 0 ? '1px solid rgba(254, 228, 64, 0.3)' : '1px solid var(--border-color)'
        }}>
          <div className="card-header-admin">
            <span className="card-title-admin">Unresolved Enquiries</span>
            <AlertCircle className="stat-card-icon" size={24} style={{ color: stats.unresolvedEnquiries > 0 ? '#eedc33' : '' }} />
          </div>
          <div className="card-body-admin">
            <h3 style={{ color: stats.unresolvedEnquiries > 0 ? '#eedc33' : '' }}>{stats.unresolvedEnquiries}</h3>
            <Link to="/admin/enquiries" className="card-link-admin">Open Inbox</Link>
          </div>
        </div>

        {/* Pending Testimonials */}
        <div className="admin-stat-card">
          <div className="card-header-admin">
            <span className="card-title-admin">Pending Reviews</span>
            <ThumbsUp className="stat-card-icon" size={24} />
          </div>
          <div className="card-body-admin">
            <h3>{stats.pendingTestimonials}</h3>
            <Link to="/admin/testimonials" className="card-link-admin">Moderate Reviews</Link>
          </div>
        </div>

        {/* Total Services */}
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
      </div>

      {/* Chart and Recent activity grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginTop: '30px' }}>
        
        {/* Simple Chart */}
        <div className="dashboard-table-card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <h3>Booking Trends</h3>
          <div style={{ flex: 1, width: '100%', height: '100%', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a961" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c9a961" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--lux-text-dim)" fontSize={11} />
                <YAxis stroke="var(--lux-text-dim)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: '#121420', border: '1px solid var(--lux-gold)', borderRadius: '4px' }} 
                  labelStyle={{ color: 'var(--lux-gold)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#c9a961" strokeWidth={2} fillOpacity={1} fill="url(#colorGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Needed list */}
        <div className="dashboard-table-card" style={{ maxHeight: '360px', overflowY: 'auto' }}>
          <h3>Pending Action Items</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {recentBookings.filter(b => b.status === 'pending').map(b => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid var(--lux-gold)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--lux-gold)', fontWeight: 'bold', textTransform: 'uppercase' }}>Booking Request</span>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--lux-text-light)' }}>{b.customer?.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.eventService?.title}</span>
                </div>
                <Link to="/admin/bookings" style={{ color: 'var(--lux-gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  Review <ChevronRight size={14} />
                </Link>
              </div>
            ))}

            {recentEnquiries.filter(e => !e.isResolved).map(e => (
              <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #eedc33' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#eedc33', fontWeight: 'bold', textTransform: 'uppercase' }}>Client Enquiry</span>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--lux-text-light)' }}>{e.name}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="truncate-text">{e.message}</span>
                </div>
                <Link to="/admin/enquiries" style={{ color: 'var(--lux-gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  Resolve <ChevronRight size={14} />
                </Link>
              </div>
            ))}

            {stats.pendingBookings === 0 && stats.unresolvedEnquiries === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>All pending tasks have been actioned!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
