import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
              <a
                href="tel:+2349035586766"
                className="text-sm text-muted hover:text-primary transition-colors hidden lg:block">
                +234 9035586766
              </a>
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-all duration-200 active:scale-95">
                List Your Property
              </button>
            </div>

            {/* Mobile menu toggle */}
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
            isOpen ? "max-h-96 border-t border-gray-100" : "max-h-0",
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
              <button
                className="w-full py-3 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-dark transition-colors"
                onClick={() => {
                  navigate("/contact");
                  setIsOpen(false);
                }}>
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-16 lg:h-18" />
    </>
  );
}
