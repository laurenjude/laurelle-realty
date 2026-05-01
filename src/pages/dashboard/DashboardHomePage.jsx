import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heart, Calendar, ArrowRight, Building2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import { PageLoader } from "../../components/ui/LoadingSpinner";

export default function DashboardHomePage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ saved: 0, viewings: 0 });
  const [recentSaved, setRecentSaved] = useState([]);
  const [recentViewings, setRecentViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const [savedRes, viewingsRes] = await Promise.all([
        supabase
          .from("saved_properties")
          .select("*, properties(id, title, location, images, price, listing_type)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("viewings")
          .select("*, properties(id, title, location)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(4),
      ]);

      setRecentSaved(savedRes.data || []);
      setRecentViewings(viewingsRes.data || []);
      setStats({
        saved: savedRes.data?.length || 0,
        viewings: viewingsRes.data?.length || 0,
      });
      setLoading(false);
    }

    fetchData();
  }, [user?.id]);

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Dashboard — Laurelle Realty</title>
      </Helmet>

      <div className="max-w-4xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-muted">Here is an overview of your activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-5">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <Heart
                size={22}
                className="text-accent"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-dark text-3xl">{stats.saved}</p>
              <p className="text-muted text-sm">Saved Properties</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-center gap-5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Calendar
                size={22}
                className="text-primary"
              />
            </div>
            <div>
              <p className="font-heading font-bold text-dark text-3xl">{stats.viewings}</p>
              <p className="text-muted text-sm">Viewing Requests</p>
            </div>
          </div>
        </div>

        {/* Recent saved */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-dark text-lg">
              Recently Saved
            </h2>
            <Link
              to="/dashboard/saved"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentSaved.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <Heart
                size={32}
                className="text-gray-300 mx-auto mb-3"
              />
              <p className="text-muted text-sm">
                You haven&apos;t saved any properties yet.
              </p>
              <Link
                to="/properties"
                className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentSaved.map(({ id, properties: p }) => (
                <Link
                  key={id}
                  to={`/properties/${p?.id}`}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex gap-4 p-4 hover:shadow-md transition-shadow group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {p?.images?.[0] && (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-dark text-sm truncate group-hover:text-primary transition-colors">
                      {p?.title}
                    </p>
                    <p className="text-muted text-xs mt-0.5">{p?.location}</p>
                    <p className="text-accent font-semibold text-sm mt-1">
                      &#8358;{Number(p?.price).toLocaleString("en-NG")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent viewings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-dark text-lg">
              Recent Viewings
            </h2>
            <Link
              to="/dashboard/viewings"
              className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentViewings.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <Calendar
                size={32}
                className="text-gray-300 mx-auto mb-3"
              />
              <p className="text-muted text-sm">No viewings booked yet.</p>
              <Link
                to="/properties"
                className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentViewings.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Building2
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark text-sm truncate">
                      {v.properties?.title}
                    </p>
                    <p className="text-muted text-xs">
                      {v.preferred_date} &bull; {v.preferred_time}
                    </p>
                  </div>
                  <span
                    className={[
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize shrink-0",
                      v.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : v.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : v.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-500",
                    ].join(" ")}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
