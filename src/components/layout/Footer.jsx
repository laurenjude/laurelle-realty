import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ArrowRight,
} from "lucide-react";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Browse Properties" },
  { to: "/properties?listingType=sale", label: "Properties for Sale" },
  { to: "/properties?listingType=rent", label: "Properties for Rent" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const PROPERTY_TYPES = [
  { to: "/properties?type=apartment", label: "Apartments" },
  { to: "/properties?type=house", label: "Houses" },
  { to: "/properties?type=duplex", label: "Duplexes" },
  { to: "/properties?type=bungalow", label: "Bungalows" },
  { to: "/properties?type=penthouse", label: "Penthouses" },
];

const SOCIALS = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2.5 mb-5">
              <img
                src="/logo.png"
                alt="Laurelle Realty"
                className="h-9 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="font-heading font-bold text-xl">
                Laurelle<span className="text-accent"> Realty</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Where AI meets home. Discover premium residential properties
              across Lagos's most sought-after neighbourhoods with expert
              guidance and technology-driven insights.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors duration-200 group">
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 text-white">
              Property Types
            </h4>
            <ul className="space-y-3">
              {PROPERTY_TYPES.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors duration-200 group">
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-5 text-white">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin
                  size={16}
                  className="text-accent shrink-0 mt-0.5"
                />
                <span>
                  {" "}
                  Admiralty Way, Lekki Phase 1,
                  <br />
                  Lagos, Nigeria
                </span>
              </li>
              <li>
                <a
                  href="tel:+2349035586766"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-accent transition-colors">
                  <Phone
                    size={16}
                    className="text-accent shrink-0"
                  />
                  +234 903 558 6766
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@laurellerealty.com"
                  className="flex items-center gap-3 text-sm text-white/70 hover:text-accent transition-colors">
                  <Mail
                    size={16}
                    className="text-accent shrink-0"
                  />
                  hello@laurellerealty.com
                </a>
              </li>
            </ul>

            {/* Office Hours */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-xs font-medium text-white mb-2">
                Office Hours
              </p>
              <p className="text-xs text-white/60">Mon – Fri: 9am – 6pm</p>
              <p className="text-xs text-white/60">Saturday: 10am – 4pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Laurelle Realty. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <a
              href="#"
              className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a
              href="#"
              className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span>·</span>
            <a
              href="#"
              className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
