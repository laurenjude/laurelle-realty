import { User, Mail, Phone, Calendar } from "lucide-react";

export default function LeadCard({ profile }) {
  const { full_name, email, phone, created_at } = profile;

  const initials = (full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joined = new Date(created_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-dark text-sm truncate">{full_name || "—"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
          {email && (
            <span className="flex items-center gap-1.5 text-muted text-xs">
              <Mail size={12} />
              {email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5 text-muted text-xs">
              <Phone size={12} />
              {phone}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-muted text-xs">
            <Calendar size={12} />
            Joined {joined}
          </span>
        </div>
      </div>
    </div>
  );
}
