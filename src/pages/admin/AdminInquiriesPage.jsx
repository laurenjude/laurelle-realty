import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { MessageSquare, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_OPTIONS = ["new", "contacted", "closed"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setInquiries(data || []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id, status) {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status }));
  }

  const displayed =
    filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  if (loading) return <PageLoader />;

  return (
    <>
      <Helmet>
        <title>Inquiries — Admin | Laurelle Realty</title>
      </Helmet>

      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Inquiries
          </h1>
          <p className="text-muted">{inquiries.length} total submissions</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((s) => (
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
            <MessageSquare
              size={40}
              className="text-gray-300 mx-auto mb-4"
            />
            <p className="text-muted text-sm">No inquiries found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden md:table-cell">
                      Message
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-5 py-3.5 text-muted font-medium text-xs uppercase tracking-wide hidden lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayed.map((inq) => (
                    <tr
                      key={inq.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelected(inq)}>
                      <td className="px-5 py-4 font-medium text-dark">{inq.name}</td>
                      <td className="px-5 py-4 text-muted hidden sm:table-cell">
                        {inq.email}
                      </td>
                      <td className="px-5 py-4 text-muted hidden md:table-cell max-w-xs">
                        <p className="truncate">{inq.message}</p>
                      </td>
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            className={`appearance-none pl-2.5 pr-7 py-1 rounded-full text-xs font-medium cursor-pointer border-0 outline-none ${
                              STATUS_STYLES[inq.status]
                            }`}>
                            {STATUS_OPTIONS.map((s) => (
                              <option
                                key={s}
                                value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={11}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted text-xs hidden lg:table-cell">
                        {new Date(inq.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Inquiry Details"
        size="md">
        {selected && (
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs mb-0.5">Name</p>
                <p className="font-medium text-dark">{selected.name}</p>
              </div>
              <div>
                <p className="text-muted text-xs mb-0.5">Email</p>
                <p className="font-medium text-dark">{selected.email}</p>
              </div>
              {selected.phone && (
                <div>
                  <p className="text-muted text-xs mb-0.5">Phone</p>
                  <p className="font-medium text-dark">{selected.phone}</p>
                </div>
              )}
              <div>
                <p className="text-muted text-xs mb-0.5">Date</p>
                <p className="font-medium text-dark">
                  {new Date(selected.created_at).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted text-xs mb-1">Message</p>
              <p className="text-dark text-sm leading-relaxed bg-gray-50 rounded-xl p-4">
                {selected.message}
              </p>
            </div>

            <div>
              <p className="text-muted text-xs mb-2">Update Status</p>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors",
                      selected.status === s
                        ? STATUS_STYLES[s]
                        : "bg-gray-100 text-muted hover:bg-gray-200",
                    ].join(" ")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
