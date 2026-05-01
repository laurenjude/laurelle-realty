import { useState } from "react";
import { CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import Modal from "../ui/Modal";
import Input, { Select, Textarea } from "../ui/Input";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import useViewings from "../../hooks/useViewings";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const EMPTY = { date: "", time: "", notes: "" };

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export default function BookViewingModal({ isOpen, onClose, property }) {
  const { user } = useAuth();
  const { createViewing } = useViewings();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (submitError) setSubmitError("");
  }

  function validate() {
    const errs = {};
    if (!form.date) {
      errs.date = "Please select a date";
    } else if (form.date <= getTodayString()) {
      errs.date = "Please select a future date";
    }
    if (!form.time) errs.time = "Please select a time";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      await createViewing({
        propertyId: property.id,
        date: form.date,
        time: form.time,
        notes: form.notes.trim() || null,
      });
      setSuccess(true);
      setForm(EMPTY);
    } catch (err) {
      console.error("Book viewing error:", err);
      setSubmitError(err?.message || "Failed to book viewing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setForm(EMPTY);
    setErrors({});
    setSubmitError("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Book a Viewing"
      size="md">
      <div className="px-6 py-5">
        {/* Property summary */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
          {property?.images?.[0] && (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-14 h-14 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-dark text-sm truncate">{property?.title}</p>
            <p className="text-muted text-xs">{property?.location}</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2
                size={28}
                className="text-success"
              />
            </div>
            <h3 className="font-heading font-bold text-dark text-xl mb-2">
              Viewing Requested!
            </h3>
            <p className="text-muted text-sm mb-6">
              Our team will confirm your viewing appointment within 24 hours. Check your
              dashboard for updates.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleClose}
              className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Preferred Date"
                type="date"
                value={form.date}
                error={errors.date}
                min={getTodayString()}
                onChange={(e) => set("date", e.target.value)}
                required
              />
              <Select
                label="Preferred Time"
                value={form.time}
                error={errors.time}
                onChange={(e) => set("time", e.target.value)}
                required>
                <option value="">Select a time</option>
                {TIME_SLOTS.map((t) => (
                  <option
                    key={t}
                    value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Additional Notes"
              placeholder="Any special requirements or questions for the agent?"
              value={form.notes}
              rows={3}
              onChange={(e) => set("notes", e.target.value)}
            />

            {submitError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-error rounded-xl px-4 py-3">
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                />
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleClose}
                className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                disabled={loading}
                className="flex-1">
                <Calendar size={16} />
                {loading ? "Booking..." : "Confirm Viewing"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
