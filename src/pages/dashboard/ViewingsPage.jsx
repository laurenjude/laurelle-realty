import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import useViewings from "../../hooks/useViewings";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useState } from "react";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function ViewingsPage() {
  const { viewings, loading, cancelViewing } = useViewings();
  const [confirm, setConfirm] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    if (!confirm) return;
    setCancelling(true);
    await cancelViewing(confirm);
    setCancelling(false);
    setConfirm(null);
  }

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>My Viewings — Laurelle Realty</title>
      </Helmet>

      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            My Viewings
          </h1>
          <p className="text-muted">
            {viewings.length} viewing {viewings.length === 1 ? "request" : "requests"}
          </p>
        </div>

        {viewings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <Calendar
              size={40}
              className="text-gray-300 mx-auto mb-4"
            />
            <h2 className="font-heading font-semibold text-dark text-xl mb-2">
              No viewings booked
            </h2>
            <p className="text-muted text-sm mb-6">
              Find a property you love and book a viewing directly from the listing page.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {viewings.map((v) => {
              const p = v.properties;
              const formattedDate = v.preferred_date
                ? new Date(v.preferred_date + "T00:00:00").toLocaleDateString("en-NG", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—";

              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
                  {/* Property thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    {p?.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar
                          size={24}
                          className="text-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Link
                        to={`/properties/${p?.id}`}
                        className="font-semibold text-dark text-sm truncate hover:text-primary transition-colors">
                        {p?.title}
                      </Link>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 capitalize ${
                          STATUS_STYLES[v.status] || STATUS_STYLES.pending
                        }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      {p?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {p.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {v.preferred_time}
                      </span>
                    </div>

                    {v.notes && (
                      <p className="text-xs text-muted mt-2 bg-gray-50 rounded-lg px-3 py-2 line-clamp-1">
                        {v.notes}
                      </p>
                    )}

                    {v.status === "pending" && (
                      <button
                        onClick={() => setConfirm(v.id)}
                        className="mt-3 flex items-center gap-1.5 text-xs text-muted hover:text-error transition-colors">
                        <X size={13} />
                        Cancel viewing
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleCancel}
        title="Cancel this viewing?"
        message="The viewing request will be marked as cancelled. You can book a new one at any time."
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep"
        isDangerous
        loading={cancelling}
      />
    </>
  );
}
