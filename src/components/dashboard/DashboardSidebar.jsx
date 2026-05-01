import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Heart, Calendar, User, LogOut, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/saved", label: "Saved Properties", icon: Heart },
  { to: "/dashboard/viewings", label: "My Viewings", icon: Calendar },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-heading font-bold text-primary text-lg">
            My Dashboard
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-dark text-sm truncate">
              {profile?.full_name || "Buyer"}
            </p>
            <p className="text-muted text-xs truncate">{profile?.email}</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-dark hover:bg-gray-50 hover:text-primary",
                  ].join(" ")
                }>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-error hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
