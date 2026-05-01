import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Users } from "lucide-react";
import { supabase } from "../../lib/supabase";
import LeadCard from "../../components/admin/LeadCard";
import { PageLoader } from "../../components/ui/LoadingSpinner";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "buyer")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLeads(data || []);
        setFiltered(data || []);
        setLoading(false);
      });
  }, []);

  function handleSearch(val) {
    setSearch(val);
    const q = val.toLowerCase();
    setFiltered(
      leads.filter(
        (l) =>
          l.full_name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q),
      ),
    );
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Leads — Admin | Laurelle Realty</title>
      </Helmet>

      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Leads
          </h1>
          <p className="text-muted">{leads.length} registered buyers</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-dark bg-white outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users
              size={40}
              className="text-gray-300 mx-auto mb-4"
            />
            <p className="text-muted text-sm">
              {search ? "No leads match your search." : "No registered buyers yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                profile={lead}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
