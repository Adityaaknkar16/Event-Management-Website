import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  CalendarRange, 
  Image, 
  HelpCircle, 
  LogOut, 
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { path: '/admin/services', label: 'Manage Services', icon: <Settings size={18} /> },
    { path: '/admin/bookings', label: 'Manage Bookings', icon: <CalendarRange size={18} /> },
    { path: '/admin/gallery', label: 'Manage Gallery', icon: <Image size={18} /> },
    { path: '/admin/enquiries', label: 'Enquiries', icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand">
            <CalendarCheck className="brand-icon" />
            <span>Vibe Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <p className="admin-user-name">{user?.name || 'Administrator'}</p>
            <p className="admin-user-email">{user?.email}</p>
          </div>
          <Link to="/" className="admin-nav-item back-home-item">
            <ArrowLeft size={18} />
            <span>Back to Website</span>
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="admin-topbar">
          <h2>Admin Management Panel</h2>
          <div className="topbar-actions">
            <span className="role-tag">Admin Mode</span>
          </div>
        </header>

        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
