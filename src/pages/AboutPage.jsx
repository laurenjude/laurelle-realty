import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react";

const VALUES = [
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We operate with complete transparency. Every listing is verified, every price is accurate, and every commitment is honoured.",
  },
  {
    icon: Target,
    title: "Precision",
    description:
      "Our AI-driven approach ensures we match clients with exactly the right property — not just something close.",
  },
  {
    icon: Users,
    title: "Client-First",
    description:
      "Your goals are our goals. We measure success by the satisfaction and long-term outcomes of our clients.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We continuously invest in technology and expertise to stay ahead of Lagos's fast-moving property market.",
  },
];

const TEAM = [
  {
    name: "Chidinma Okafor",
    role: "Founder & CEO",
    bio: "Former Goldman Sachs analyst with 15 years in Lagos real estate.",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&q=80&fit=crop&crop=face",
  },
  {
    name: "Tunde Fashola",
    role: "Head of Properties",
    bio: "Certified estate surveyor with deep knowledge of Lekki and VI markets.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&q=80&fit=crop&crop=face",
  },
  {
    name: "Ngozi Adeyemi",
    role: "AI & Technology Lead",
    bio: "Ex-Google engineer building smart tools for smarter property decisions.",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&q=80&fit=crop&crop=face",
  },
  {
    name: "Emeka Obi",
    role: "Client Experience",
    bio: "Dedicated to ensuring every client interaction exceeds expectations.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&q=80&fit=crop&crop=face",
  },
];

const MILESTONES = [
  { year: "2009", event: "Founded in Lekki Phase 1 with a team of 3 agents" },
  { year: "2014", event: "Expanded to 5 Lagos neighbourhoods, 200+ listings" },
  {
    year: "2019",
    event: "Launched our proprietary property matching technology",
  },
  {
    year: "2022",
    event: "Crossed ₦50 billion in total transactions facilitated",
  },
  {
    year: "2024",
    event: "Integrated AI-powered search and market intelligence",
  },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Laurelle Realty</title>
        <meta
          name="description"
          content="Learn about Laurelle Realty Lagos's premier AI-powered real estate platform. Our story, mission, values, and team."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=60&auto=format&fit=crop)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
              Our Story
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Redefining Real Estate
              <br />
              in Lagos
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Since 2009, Laurelle Realty has helped thousands of Lagos
              residents and investors find homes they love and investments they
              trust. We combine over 15 years of local expertise with
              cutting-edge AI technology to create an experience that genuinely
              feels different.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/20">
            {[
              { value: "1,200+", label: "Happy Clients" },
              { value: "₦50B+", label: "Transactions Closed" },
              { value: "500+", label: "Active Listings" },
              { value: "15+", label: "Years in Lagos" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="py-7 px-6 text-center">
                <p className="font-heading font-bold text-2xl sm:text-3xl text-white">
                  {value}
                </p>
                <p className="text-white/80 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop"
                alt="Laurelle Realty office"
                className="rounded-2xl w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target
                        size={20}
                        className="text-primary"
                      />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-dark">
                      Our Mission
                    </h2>
                  </div>
                  <p className="text-dark/75 leading-relaxed">
                    To democratise access to premium real estate in Lagos by
                    combining AI-driven technology with human expertise making
                    the process of finding, buying, or renting property
                    transparent, efficient, and genuinely enjoyable.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Eye
                        size={20}
                        className="text-accent"
                      />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-dark">
                      Our Vision
                    </h2>
                  </div>
                  <p className="text-dark/75 leading-relaxed">
                    To become West Africa's most trusted and technologically
                    advanced residential property platform beginning in Lagos
                    and expanding across the continent's fastest-growing cities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
              What We Stand For
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-11 h-11 bg-primary/8 rounded-xl flex items-center justify-center mb-4">
                  <Icon
                    size={20}
                    className="text-primary"
                  />
                </div>
                <h3 className="font-heading font-semibold text-dark text-lg mb-2">
                  {title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
              Our Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark">
              Milestones
            </h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {MILESTONES.map(({ year, event }, i) => (
              <div
                key={year}
                className="flex gap-6 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {year.slice(2)}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-0.5 h-10 bg-primary/15 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-accent text-sm font-semibold mb-0.5">
                    {year}
                  </p>
                  <p className="text-dark text-sm leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
              The People
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
              Meet Our Team
            </h2>
            <p className="text-muted max-w-md mx-auto">
              A dedicated group of real estate professionals, technologists, and
              Lagos specialists united by a single goal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, bio, avatar }) => (
              <div
                key={name}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-dark">
                    {name}
                  </h3>
                  <p className="text-accent text-sm font-medium mb-2">{role}</p>
                  <p className="text-muted text-xs leading-relaxed">{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Browse our curated listings or get in touch with our team for
            personalised guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-all">
              Browse Properties
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
