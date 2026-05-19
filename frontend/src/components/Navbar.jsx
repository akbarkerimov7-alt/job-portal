import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight text-brand-700 dark:text-brand-100">
          JobPortal
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Jobs
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/jobs/create" className={linkClass}>
                Post Job
              </NavLink>
              <NavLink to="/profile#chats" className={linkClass}>
                Chats
              </NavLink>
              <NavLink to="/profile" className={linkClass}>
                {user?.name || 'Profile'}
              </NavLink>
            </>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          ) : (
            <button type="button" onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
