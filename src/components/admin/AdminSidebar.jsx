import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  Calendar,
  LogOut,
  X,
  Plus,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/viewings", label: "Viewings", icon: Calendar },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  const initials = (profile?.full_name || "A")
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
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 bg-primary flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="font-heading font-bold text-white text-lg">
            Admin Panel
          </span>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Admin info */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {profile?.full_name || "Admin"}
            </p>
            <p className="text-white/50 text-xs truncate">{profile?.email}</p>
          </div>
        </div>

        {/* Quick action */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              navigate("/admin/properties/new");
              onClose();
            }}
            className="flex items-center gap-2 w-full px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors">
            <Plus size={16} />
            Add New Property
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
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
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
