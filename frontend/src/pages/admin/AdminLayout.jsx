import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { 
  LayoutDashboard, 
  Settings, 
  CalendarRange, 
  Image, 
  HelpCircle, 
  LogOut, 
  ArrowLeft,
  CalendarCheck,
  Bell,
  CheckSquare
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const [bookingsRes, enquiriesRes, testimonialsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/enquiries'),
        api.get('/testimonials/admin'),
      ]);

      const pendingBookings = bookingsRes.data.filter(b => b.status === 'pending').length;
      const unresolvedEnquiries = enquiriesRes.data.filter(e => !e.isResolved).length;
      const pendingTestimonials = testimonialsRes.data.filter(t => !t.isApproved).length;

      setNotificationCount(pendingBookings + unresolvedEnquiries + pendingTestimonials);
    } catch (err) {
      console.error('Failed to load notification stats', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { path: '/admin/services', label: 'Services', icon: <Settings size={18} /> },
    { path: '/admin/bookings', label: 'Bookings', icon: <CalendarRange size={18} /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <Image size={18} /> },
    { path: '/admin/testimonials', label: 'Testimonials', icon: <CheckSquare size={18} /> },
    { path: '/admin/enquiries', label: 'Enquiries', icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ borderRight: '1px solid rgba(201, 169, 97, 0.15)', background: '#090909' }}>
        <div className="admin-sidebar-header" style={{ borderBottom: '1px solid rgba(201, 169, 97, 0.15)' }}>
          <Link to="/" className="admin-brand">
            <CalendarCheck className="brand-icon" style={{ color: 'var(--lux-gold)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Vibe Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
              style={({ isActive }) => ({
                color: isActive ? 'var(--lux-text-light)' : 'var(--lux-text-dim)',
                borderLeft: isActive ? '3px solid var(--lux-gold)' : 'none'
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer" style={{ borderTop: '1px solid rgba(201, 169, 97, 0.15)' }}>
          <div className="admin-user-info">
            <p className="admin-user-name" style={{ color: 'var(--lux-text-light)' }}>{user?.name || 'Administrator'}</p>
            <p className="admin-user-email" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <Link to="/" className="admin-nav-item back-home-item" style={{ color: 'var(--lux-text-dim)' }}>
            <ArrowLeft size={18} />
            <span>Back to Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="admin-topbar" style={{ borderBottom: '1px solid rgba(201, 169, 97, 0.15)', background: '#090909' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--lux-text-light)' }}>Concierge Management</h2>
          
          <div className="topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }} title={`${notificationCount} items need attention`}>
              <Bell size={20} style={{ color: notificationCount > 0 ? 'var(--lux-gold)' : 'var(--lux-text-dim)' }} />
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--danger)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notificationCount}
                </span>
              )}
            </div>

            <span className="role-tag" style={{ border: '1px solid var(--lux-gold)', color: 'var(--lux-gold)', background: 'var(--lux-gold-glow)' }}>Admin Mode</span>
          </div>
        </header>

        <div className="admin-page-container">
          <Outlet context={{ refreshNotifications: fetchNotifications }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
