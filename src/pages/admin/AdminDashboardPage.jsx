import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Building2, Users, MessageSquare, Calendar, Plus, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { PageLoader } from "../../components/ui/LoadingSpinner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentViewings, setRecentViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [propsRes, leadsRes, inqRes, viewsRes] = await Promise.all([
        supabase.from("properties").select("id, status", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }).eq("role", "buyer"),
        supabase
          .from("inquiries")
          .select("id, name, email, message, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("viewings")
          .select("id, preferred_date, preferred_time, status, profiles(full_name), properties(title)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const props = propsRes.data || [];
      setStats({
        totalProperties: propsRes.count || 0,
        activeListings: props.filter((p) => p.status === "available").length,
        totalLeads: leadsRes.count || 0,
        pendingViewings: (viewsRes.data || []).filter((v) => v.status === "pending").length,
      });
      setRecentInquiries(inqRes.data || []);
      setRecentViewings(viewsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const STAT_CARDS = [
    { label: "Total Properties", value: stats.totalProperties, icon: Building2, color: "bg-primary/10 text-primary", to: "/admin/properties" },
    { label: "Active Listings", value: stats.activeListings, icon: Building2, color: "bg-green-100 text-green-700", to: "/admin/properties" },
    { label: "Registered Leads", value: stats.totalLeads, icon: Users, color: "bg-blue-100 text-blue-700", to: "/admin/leads" },
    { label: "Pending Viewings", value: stats.pendingViewings, icon: Calendar, color: "bg-yellow-100 text-yellow-700", to: "/admin/viewings" },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard — Laurelle Realty</title>
      </Helmet>

      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
              Admin Dashboard
            </h1>
            <p className="text-muted">Overview of all platform activity</p>
          </div>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors text-sm">
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, to }) => (
            <Link
              key={label}
              to={to}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="font-heading font-bold text-dark text-2xl">{value}</p>
              <p className="text-muted text-xs mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent inquiries */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-dark">Recent Inquiries</h2>
              <Link
                to="/admin/inquiries"
                className="text-primary text-sm hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <p className="text-muted text-sm">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-muted text-xs font-bold">
                      {(inq.name || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-sm font-medium">{inq.name}</p>
                      <p className="text-muted text-xs truncate">{inq.message}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${
                      inq.status === "new" ? "bg-blue-100 text-blue-700" :
                      inq.status === "contacted" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent viewings */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-dark">Recent Viewings</h2>
              <Link
                to="/admin/viewings"
                className="text-primary text-sm hover:underline flex items-center gap-1">
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {recentViewings.length === 0 ? (
              <p className="text-muted text-sm">No viewings yet.</p>
            ) : (
              <div className="space-y-3">
                {recentViewings.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Calendar
                        size={14}
                        className="text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-dark text-sm font-medium truncate">
                        {v.properties?.title}
                      </p>
                      <p className="text-muted text-xs">
                        {v.profiles?.full_name} &bull; {v.preferred_date} {v.preferred_time}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${
                      v.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      v.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
