import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Plus, Pencil, Trash2, Star, StarOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../utils/formatters";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const FALLBACK =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&q=60&auto=format&fit=crop";

const STATUS_STYLES = {
  available: "bg-green-100 text-green-700",
  sold: "bg-red-100 text-red-700",
  rented: "bg-blue-100 text-blue-700",
};

export default function AdminPropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase
      .from("properties")
      .select("id, title, property_type, listing_type, price, location, status, featured, images")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProperties(data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("properties").delete().eq("id", deleteTarget);
    setProperties((prev) => prev.filter((p) => p.id !== deleteTarget));
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function toggleFeatured(id, current) {
    await supabase.from("properties").update({ featured: !current }).eq("id", id);
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p)),
    );
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Properties — Admin | Laurelle Realty</title>
      </Helmet>

      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
              Properties
            </h1>
            <p className="text-muted">{properties.length} total listings</p>
          </div>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent-dark transition-colors text-sm">
            <Plus size={16} />
            Add Property
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {properties.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted text-sm mb-4">No properties yet.</p>
              <Link
                to="/admin/properties/new"
                className="text-primary font-medium hover:underline text-sm">
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide">
                      Property
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden sm:table-cell">
                      Price
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden lg:table-cell">
                      Location
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || FALLBACK}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK;
                            }}
                          />
                          <span className="font-medium text-dark line-clamp-2 leading-tight">
                            {p.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="capitalize text-muted">{p.property_type}</span>
                        <span className="block text-xs text-muted/70 capitalize">
                          {p.listing_type === "sale" ? "For Sale" : "For Rent"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell font-semibold text-dark">
                        {formatPrice(p.price)}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-muted">
                        {p.location}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            STATUS_STYLES[p.status] || "bg-gray-100 text-gray-500"
                          }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleFeatured(p.id, p.featured)}
                            title={p.featured ? "Remove featured" : "Mark featured"}
                            className={`p-2 rounded-lg transition-colors ${
                              p.featured
                                ? "text-accent hover:bg-accent/10"
                                : "text-gray-300 hover:text-accent hover:bg-accent/10"
                            }`}>
                            {p.featured ? <Star size={15} /> : <StarOff size={15} />}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/properties/${p.id}/edit`)}
                            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p.id)}
                            className="p-2 rounded-lg text-muted hover:text-error hover:bg-red-50 transition-colors"
                            title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete property?"
        message="This will permanently delete the property and all associated saved records and viewings. This cannot be undone."
        confirmLabel="Delete"
        isDangerous
        loading={deleting}
      />
    </>
  );
}
