import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, ChevronDown } from "lucide-react";
import Button from "../ui/Button";

const HERO_BG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80&auto=format&fit=crop";

const LOCATIONS = [
  "Lekki Phase 1",
  "Victoria Island",
  "Ikoyi",
  "Ajah",
  "Magodo",
  "Ikeja GRA",
  "Banana Island",
  "Oniru",
  "Chevron",
  "Sangotedo",
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "duplex", label: "Duplex" },
  { value: "bungalow", label: "Bungalow" },
  { value: "penthouse", label: "Penthouse" },
];

const STATS = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
];

export default function Hero() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    propertyType: "",
    listingType: "",
  });

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.location) params.set("location", form.location);
    if (form.propertyType) params.set("type", form.propertyType);
    if (form.listingType) params.set("listingType", form.listingType);
    navigate(`/properties?${params.toString()}`);
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        role="img"
        aria-label="Luxury Lagos property"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/75 to-primary/30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-7">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            AI-Powered Real Estate Platform
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-5">
            Find Your Dream
            <br />
            <span className="text-accent italic">Home in Lagos</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/80 text-base sm:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl">
            Discover premium residential properties across Lagos's most
            exclusive neighbourhoods. Verified listings, AI-powered matching,
            and expert local guidance all in one place.
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-3 shadow-2xl shadow-black/30">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
              {/* Location */}
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <MapPin
                  size={16}
                  className="text-primary shrink-0"
                />
                <select
                  className="flex-1 bg-transparent text-dark text-sm outline-none cursor-pointer"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}>
                  <option value="">Any Location</option>
                  {LOCATIONS.map((loc) => (
                    <option
                      key={loc}
                      value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property type */}
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <Home
                  size={16}
                  className="text-primary shrink-0"
                />
                <select
                  className="flex-1 bg-transparent text-dark text-sm outline-none cursor-pointer"
                  value={form.propertyType}
                  onChange={(e) => set("propertyType", e.target.value)}>
                  <option value="">Any Type</option>
                  {PROPERTY_TYPES.map(({ value, label }) => (
                    <option
                      key={value}
                      value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto whitespace-nowrap">
                <Search size={16} />
                Search
              </Button>
            </div>

            {/* Listing type quick toggle */}
            <div className="flex items-center gap-2 mt-3 px-1">
              <span className="text-muted text-xs">Looking to:</span>
              {["", "sale", "rent"].map((val, i) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set("listingType", val)}
                  className={[
                    "px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200",
                    form.listingType === val
                      ? "bg-primary text-white"
                      : "text-muted hover:text-dark hover:bg-gray-50",
                  ].join(" ")}>
                  {val === "" ? "Buy or Rent" : val === "sale" ? "Buy" : "Rent"}
                </button>
              ))}
            </div>
          </form>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading font-bold text-2xl sm:text-3xl text-accent">
                  {value}
                </div>
                <div className="text-white/60 text-xs sm:text-sm mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-2.5 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
