import { Calendar, Clock, MapPin, User } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function ViewingCard({ viewing, onConfirm, onCancel }) {
  const { preferred_date, preferred_time, status, notes, properties, profiles } = viewing;

  const formattedDate = preferred_date
    ? new Date(preferred_date + "T00:00:00").toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-dark text-sm truncate">
            {properties?.title || "Unknown Property"}
          </p>
          <p className="text-muted text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={11} />
            {properties?.location || "—"}
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 capitalize ${
            STATUS_STYLES[status] || STATUS_STYLES.pending
          }`}>
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-3">
        <span className="flex items-center gap-1.5">
          <User size={12} />
          {profiles?.full_name || "—"} &bull; {profiles?.email || ""}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {formattedDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} />
          {preferred_time}
        </span>
      </div>

      {notes && (
        <p className="text-xs text-muted bg-gray-50 rounded-lg px-3 py-2 mb-3 line-clamp-2">
          {notes}
        </p>
      )}

      {status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-1.5 px-3 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition-colors">
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-1.5 px-3 border border-gray-200 text-muted text-xs font-medium rounded-lg hover:bg-gray-50 hover:text-error transition-colors">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
