import { useGetUser } from '@/features/auth/hooks';
import { NavLink, Outlet } from 'react-router';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/events', label: 'Events' },
  { to: '/chat', label: 'Assistant' },
];

export function RootLayout() {
  const { data: user } = useGetUser();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="font-semibold">ITC Hub</span>
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }
            >
              {label}
            </NavLink>
          ))}
          <span className="ml-auto text-sm text-slate-600">
            {user ? (
              <div>
                <span>{user.email}</span>
                <button className="bg-accent text-on-accent hover:bg-">Logout</button>
              </div>
            ) : (
              <NavLink to="/register">Register</NavLink>
            )}
          </span>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
