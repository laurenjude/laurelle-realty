import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heart, Trash2, MapPin, Bed, Bath } from "lucide-react";
import { supabase } from "../../lib/supabase";
import useAuth from "../../hooks/useAuth";
import { useSavedProperties } from "../../contexts/SavedPropertiesContext";
import { formatPrice } from "../../utils/formatters";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function SavedPropertiesPage() {
  const { user } = useAuth();
  const { toggle } = useSavedProperties();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_properties")
      .select("id, property_id, properties(id, title, location, price, listing_type, bedrooms, bathrooms, images)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSaved(data || []);
        setLoading(false);
      });
  }, [user?.id]);

  async function handleRemove(savedId, propertyId) {
    setRemoving(savedId);
    await toggle(propertyId);
    setSaved((prev) => prev.filter((s) => s.id !== savedId));
    setRemoving(null);
    setConfirm(null);
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Saved Properties — Laurelle Realty</title>
      </Helmet>

      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Saved Properties
          </h1>
          <p className="text-muted">
            {saved.length} {saved.length === 1 ? "property" : "properties"} saved
          </p>
        </div>

        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <Heart
              size={40}
              className="text-gray-300 mx-auto mb-4"
            />
            <h2 className="font-heading font-semibold text-dark text-xl mb-2">
              No saved properties yet
            </h2>
            <p className="text-muted text-sm mb-6">
              Browse our listings and click the heart icon to save properties you love.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {saved.map(({ id: savedId, properties: p }) => (
              <div
                key={savedId}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <Link to={`/properties/${p?.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                    {p?.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart
                          size={32}
                          className="text-gray-300"
                        />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p?.listing_type === "rent"
                          ? "bg-blue-500 text-white"
                          : "bg-accent text-white"
                      }`}>
                      {p?.listing_type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="font-semibold text-dark text-base line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {p?.title}
                  </p>
                  <p className="text-accent font-bold text-lg mb-2">
                    {formatPrice(p?.price)}
                  </p>
                  <p className="text-muted text-xs flex items-center gap-1 mb-3">
                    <MapPin size={11} />
                    {p?.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      {p?.bedrooms != null && (
                        <span className="flex items-center gap-1">
                          <Bed size={12} />
                          {p.bedrooms} Beds
                        </span>
                      )}
                      {p?.bathrooms != null && (
                        <span className="flex items-center gap-1">
                          <Bath size={12} />
                          {p.bathrooms} Baths
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setConfirm({ savedId, propertyId: p?.id })}
                      disabled={removing === savedId}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-error transition-colors py-1 px-2 rounded-lg hover:bg-red-50">
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => handleRemove(confirm.savedId, confirm.propertyId)}
        title="Remove from saved?"
        message="This property will be removed from your saved list. You can always save it again later."
        confirmLabel="Remove"
        cancelLabel="Keep"
        isDangerous
        loading={!!removing}
      />
    </>
  );
}
