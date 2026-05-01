import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Heart,
  Calendar,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user, profile, isAdmin, signOut, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
  }

  const initials = (profile?.full_name || user?.email || "U")
    .split(/[\s@]/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const buyerMenuItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/saved", label: "Saved Properties", icon: Heart },
    { to: "/dashboard/viewings", label: "My Viewings", icon: Calendar },
    { to: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const adminMenuItems = [
    { to: "/admin", label: "Admin Panel", icon: Shield },
    { to: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const menuItems = isAdmin ? adminMenuItems : buyerMenuItems;

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white shadow-md shadow-black/5"
            : "bg-white/98 backdrop-blur-sm",
        ].join(" ")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
              onClick={() => setIsOpen(false)}>
              <img
                src="/logo.png"
                alt="Laurelle Realty"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="font-heading font-bold text-xl text-primary tracking-tight">
                Laurelle<span className="text-accent"> Realty</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    [
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-dark hover:text-primary hover:bg-gray-50",
                    ].join(" ")
                  }>
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-8 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="w-20 h-9 rounded-xl bg-gray-100 animate-pulse" />
                </div>
              )}

              {!loading && !user && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-dark hover:text-primary transition-colors rounded-lg hover:bg-gray-50">
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-all duration-200 active:scale-95">
                    Sign Up
                  </Link>
                </>
              )}

              {!loading && user && (
                <div
                  ref={dropdownRef}
                  className="relative">
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-dark max-w-[120px] truncate">
                      {profile?.full_name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-muted transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-dark text-sm font-medium truncate">
                          {profile?.full_name || "—"}
                        </p>
                        <p className="text-muted text-xs truncate">{profile?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-accent/15 text-accent rounded-full text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        {menuItems.map(({ to, label, icon: Icon }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:text-primary hover:bg-gray-50 transition-colors">
                            <Icon
                              size={15}
                              className="text-muted"
                            />
                            {label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-50 py-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-muted hover:text-error hover:bg-red-50 transition-colors">
                          <LogOut size={15} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-dark hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen((o) => !o)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={[
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-screen border-t border-gray-100" : "max-h-0",
          ].join(" ")}>
          <div className="bg-white px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-dark hover:text-primary hover:bg-gray-50",
                  ].join(" ")
                }
                onClick={() => setIsOpen(false)}>
                {label}
              </NavLink>
            ))}

            <div className="mt-2 pt-3 border-t border-gray-100">
              {loading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-11 rounded-xl bg-gray-100 animate-pulse" />
                  <div className="h-11 rounded-xl bg-gray-100 animate-pulse" />
                </div>
              ) : !user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-center text-sm font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors">
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 text-center text-sm font-medium bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors">
                    Sign Up Free
                  </Link>
                </div>
              ) : user ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 mb-1">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-dark text-sm font-medium truncate">
                        {profile?.full_name || "—"}
                      </p>
                      <p className="text-muted text-xs truncate">{profile?.email}</p>
                    </div>
                  </div>
                  {menuItems.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:text-primary hover:bg-gray-50 rounded-xl transition-colors">
                      <Icon
                        size={15}
                        className="text-muted"
                      />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-error hover:bg-red-50 rounded-xl transition-colors mt-1">
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 lg:h-18" />
    </>
  );
}
