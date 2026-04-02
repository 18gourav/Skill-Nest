import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function Shell({ children }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff_0%,_#f8fafc_42%,_#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/" className="text-lg font-black tracking-tight text-slate-950 md:text-xl">
            Skill Nest
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/courses" className={navClass}>
              Courses
            </NavLink>
            <Link to="/#about" className={navClass({ isActive: false })}>
              About
            </Link>

            {user ? (
              <>
                <NavLink to="/dashboard" className={navClass}>
                  Dashboard
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin/courses" className={navClass}>
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={logout}
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">{children}</main>
    </div>
  );
}
