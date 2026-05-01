import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar } from "lucide-react";
import { supabase } from "../../lib/supabase";
import ViewingCard from "../../components/admin/ViewingCard";
import { PageLoader } from "../../components/ui/LoadingSpinner";

const STATUS_OPTIONS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AdminViewingsPage() {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("viewings")
      .select("*, properties(id, title, location), profiles(full_name, email, phone)")
      .order("preferred_date", { ascending: true })
      .then(({ data }) => {
        setViewings(data || []);
        setLoading(false);
      });
  }, []);

  async function handleConfirm(id) {
    await supabase.from("viewings").update({ status: "confirmed" }).eq("id", id);
    setViewings((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "confirmed" } : v)),
    );
  }

  async function handleCancel(id) {
    await supabase.from("viewings").update({ status: "cancelled" }).eq("id", id);
    setViewings((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "cancelled" } : v)),
    );
  }

  const displayed =
    filter === "all" ? viewings : viewings.filter((v) => v.status === filter);

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Viewings — Admin | Laurelle Realty</title>
      </Helmet>

      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Viewings
          </h1>
          <p className="text-muted">{viewings.length} total requests</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                filter === s
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-200 text-muted hover:text-dark",
              ].join(" ")}>
              {s}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Calendar
              size={40}
              className="text-gray-300 mx-auto mb-4"
            />
            <p className="text-muted text-sm">No viewings found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayed.map((v) => (
              <ViewingCard
                key={v.id}
                viewing={v}
                onConfirm={() => handleConfirm(v.id)}
                onCancel={() => handleCancel(v.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
