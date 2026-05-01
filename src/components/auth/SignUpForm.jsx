import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Input from "../ui/Input";
import Button from "../ui/Button";

const PASSWORD_RE = /^(?=.*[0-9]).{8,}$/;
const NIGERIAN_PHONE_RE = /^(\+234|0)[0-9]{10}$/;

export default function SignUpForm() {
  const navigate = useNavigate();
  const { signUp, user, profile, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Redirect after profile loads (if email confirmation is disabled)
  useEffect(() => {
    if (!attempted || authLoading || emailSent) return;
    if (user && profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [attempted, authLoading, user, profile]);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (submitError) setSubmitError("");
  }

  function validate() {
    const errs = {};
    const name = form.fullName.trim();
    if (!name) errs.fullName = "Full name is required";
    else if (name.length < 2) errs.fullName = "Name must be at least 2 characters";

    const email = form.email.trim();
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    else if (!PASSWORD_RE.test(form.password))
      errs.password = "Minimum 8 characters with at least 1 number";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    const phone = form.phone.trim().replace(/\s/g, "");
    if (phone && !NIGERIAN_PHONE_RE.test(phone))
      errs.phone = "Enter a valid Nigerian number, e.g. 08012345678";

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
      const { user: newUser } = await signUp({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });

      if (newUser?.identities?.length === 0) {
        setSubmitError(
          "An account with this email already exists. Please log in instead.",
        );
        setLoading(false);
        return;
      }

      // If email confirmation required, show a message instead of redirecting
      if (!newUser?.confirmed_at && !newUser?.email_confirmed_at) {
        setEmailSent(true);
        setLoading(false);
        return;
      }

      setAttempted(true);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        setSubmitError("An account with this email already exists. Please log in.");
      } else if (msg.includes("Password should be")) {
        setSubmitError("Password must be at least 6 characters.");
      } else {
        setSubmitError(msg || "Sign up failed. Please try again.");
      }
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-dark text-xl mb-2">Check your inbox</h3>
        <p className="text-muted text-sm mb-6 max-w-xs mx-auto">
          We sent a confirmation link to{" "}
          <strong className="text-dark">{form.email}</strong>. Click it to activate your
          account, then come back to log in.
        </p>
        <Link
          to="/login"
          className="text-primary font-medium hover:underline text-sm">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate>
      <Input
        label="Full Name"
        placeholder="Adaeze Okonkwo"
        value={form.fullName}
        error={errors.fullName}
        onChange={(e) => set("fullName", e.target.value)}
        autoComplete="name"
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        error={errors.email}
        onChange={(e) => set("email", e.target.value)}
        autoComplete="email"
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="08012345678 or +2348012345678"
        value={form.phone}
        error={errors.phone}
        helperText="Optional — Nigerian format"
        onChange={(e) => set("phone", e.target.value)}
        autoComplete="tel"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 chars + 1 number"
          value={form.password}
          error={errors.password}
          onChange={(e) => set("password", e.target.value)}
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => set("confirmPassword", e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {submitError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-error rounded-xl px-4 py-3">
          <AlertCircle
            size={16}
            className="shrink-0 mt-0.5"
          />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading || (attempted && authLoading)}
        disabled={loading || (attempted && authLoading)}
        className="w-full">
        {loading || (attempted && authLoading) ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
