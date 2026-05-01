import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import Input, { Textarea, Select } from "../components/ui/Input";
import Button from "../components/ui/Button";

const ENQUIRY_TYPES = [
  "General Enquiry",
  "Buy a Property",
  "Rent a Property",
  "List My Property",
  "Investment Advice",
  "Valuation Request",
  "Partnership",
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Visit Us",
    lines: ["Admiralty Way, Lekki Phase 1", "Lagos, Nigeria"],
  },
  {
    icon: Phone,
    label: "Call Us",
    lines: ["+234 903 558 6766"],
    href: "tel:+2349035586766",
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: ["hello@laurellerealty.com", "sales@laurellerealty.com"],
    href: "mailto:hello@laurellerealty.com",
  },
  {
    icon: Clock,
    label: "Office Hours",
    lines: [
      "Mon – Fri: 9:00am – 6:00pm",
      "Saturday: 10:00am – 4:00pm",
      "Sunday: Closed",
    ],
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "",
  message: "",
};

// Loose Nigerian phone validator: accepts +234XXXXXXXXXX or 0XXXXXXXXXX (11 digits)
const NIGERIAN_PHONE_RE = /^(\+234|0)[0-9]{10}$/;

function validate(form) {
  const errors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  const phone = form.phone.trim();
  if (phone && !NIGERIAN_PHONE_RE.test(phone.replace(/\s/g, ""))) {
    errors.phone =
      "Enter a valid Nigerian number, e.g. 08012345678 or +2348012345678";
  }

  const message = form.message.trim();
  if (!message) {
    errors.message = "Please write a message";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const successTimerRef = useRef(null);

  // Auto-hide success banner after 5 s
  useEffect(() => {
    if (submitted) {
      successTimerRef.current = setTimeout(() => setSubmitted(false), 5000);
    }
    return () => clearTimeout(successTimerRef.current);
  }, [submitted]);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    // Clear field error as user types
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    // Clear global submit error on any change
    if (submitError) setSubmitError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const messageBody = form.enquiryType
        ? `[${form.enquiryType}] ${form.message.trim()}`
        : form.message.trim();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: messageBody,
        property_id: null,
      };

      const { error } = await supabase.from("inquiries").insert([payload]);

      if (error) {
        // Log the full Supabase error so it's visible in DevTools console
        console.error("[Laurelle Realty] Supabase insert error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      setSubmitted(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      console.error("[Laurelle Realty] Contact form submission failed:", err);

      // Surface a helpful message based on the error code when possible
      const code = err?.code;
      if (code === "42501") {
        setSubmitError(
          "Permission error — the database policy needs to be updated. Please contact us directly at hello@laurellerealty.com.",
        );
      } else if (code === "42P01") {
        setSubmitError(
          "The database table does not exist yet. Please run the setup SQL in Supabase first.",
        );
      } else if (!navigator.onLine) {
        setSubmitError(
          "You appear to be offline. Please check your internet connection and try again.",
        );
      } else {
        setSubmitError(
          err?.message
            ? `Submission failed: ${err.message}`
            : "Something went wrong. Please try again or email us at hello@laurellerealty.com.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us — Laurelle Realty</title>
        <meta
          name="description"
          content="Get in touch with Laurelle Realty. We're here to help you buy, rent, or list a property in Lagos. Contact us today."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
            We'd Love to Hear From You
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/70 text-lg max-w-lg mx-auto">
            Whether you're looking to buy, rent, or list a property our team is
            ready to help you every step of the way.
          </p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* ── Contact form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="font-heading text-2xl font-bold text-dark mb-1">
                  Send Us a Message
                </h2>
                <p className="text-muted text-sm mb-7">
                  Fill in the form below and we'll respond within 24 hours.
                </p>

                {/* ── Success state ── */}
                {submitted && (
                  <div className="flex items-start gap-4 bg-success/8 border border-success/20 rounded-2xl p-5 mb-6">
                    <CheckCircle2
                      size={22}
                      className="text-success shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-dark text-sm">
                        Thank you! We'll get back to you within 24 hours.
                      </p>
                      <p className="text-muted text-xs mt-1">
                        Check your inbox for a confirmation. This notice will
                        disappear shortly.
                      </p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      name="name"
                      label="Full Name"
                      placeholder="Adaeze Okonkwo"
                      required
                      value={form.name}
                      error={errors.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                    />
                    <Input
                      name="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={form.email}
                      error={errors.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="08012345678 or +2348012345678"
                      value={form.phone}
                      error={errors.phone}
                      helperText="Optional  Nigerian format"
                      onChange={(e) => set("phone", e.target.value)}
                      autoComplete="tel"
                    />
                    <Select
                      name="enquiryType"
                      label="Enquiry Type"
                      value={form.enquiryType}
                      onChange={(e) => set("enquiryType", e.target.value)}>
                      <option value="">Select a topic</option>
                      {ENQUIRY_TYPES.map((t) => (
                        <option
                          key={t}
                          value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <Textarea
                    name="message"
                    label="Your Message"
                    placeholder="Tell us how we can help you... (minimum 10 characters)"
                    required
                    rows={5}
                    value={form.message}
                    error={errors.message}
                    onChange={(e) => set("message", e.target.value)}
                  />

                  {/* Global submit error */}
                  {submitError && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-error rounded-xl px-4 py-3">
                      <AlertCircle
                        size={16}
                        className="shrink-0 mt-0.5"
                      />
                      <p className="text-sm">{submitError}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 flex-wrap">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={submitting}
                      disabled={submitting}>
                      {!submitting && <Send size={16} />}
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-muted text-xs">
                      We respond within 24 hours on business days.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Contact info sidebar ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {CONTACT_INFO.map(({ icon: Icon, label, lines, href }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center shrink-0">
                    <Icon
                      size={18}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm mb-1">
                      {label}
                    </p>
                    {lines.map((line, i) =>
                      href && i === 0 ? (
                        <a
                          key={i}
                          href={href}
                          className="block text-muted text-sm hover:text-primary transition-colors">
                          {line}
                        </a>
                      ) : (
                        <p
                          key={i}
                          className="text-muted text-sm">
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-1 min-h-48 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg,#0F4C3A 0px,#0F4C3A 1px,transparent 1px,transparent 30px),repeating-linear-gradient(90deg,#0F4C3A 0px,#0F4C3A 1px,transparent 1px,transparent 30px)",
                  }}
                />
                <div className="text-center p-6 z-10 relative">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin
                      size={18}
                      className="text-white"
                    />
                  </div>
                  <p className="font-medium text-dark text-sm">Admiralty Way</p>
                  <p className="text-muted text-xs mt-0.5">
                    Lekki Phase 1, Lagos
                  </p>
                  <p className="text-xs text-muted mt-3 bg-gray-50 px-3 py-1.5 rounded-full inline-block">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
