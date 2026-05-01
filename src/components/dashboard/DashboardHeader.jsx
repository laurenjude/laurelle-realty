import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function DashboardHeader({ onMenuToggle }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-dark transition-colors"
        aria-label="Open sidebar">
        <Menu size={20} />
      </button>

      <Link
        to="/"
        className="flex items-center gap-2 ml-auto">
        <img
          src="/logo.png"
          alt="Laurelle Realty"
          className="h-7 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span className="font-heading font-bold text-primary text-base">
          Laurelle<span className="text-accent"> Realty</span>
        </span>
      </Link>
    </header>
  );
}
