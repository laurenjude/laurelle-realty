import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, profile, loading: authLoading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const from = location.state?.from?.pathname;

  // Redirect after profile is loaded post-login
  useEffect(() => {
    if (!attempted || authLoading) return;
    if (user && profile) {
      if (profile.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from && from !== "/login" ? from : "/dashboard", { replace: true });
      }
    }
  }, [attempted, authLoading, user, profile]);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (submitError) setSubmitError("");
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
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
      await signIn({ email: form.email.trim(), password: form.password });
      setAttempted(true);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("Invalid login credentials")) {
        setSubmitError("Incorrect email or password. Please try again.");
      } else if (msg.includes("Email not confirmed")) {
        setSubmitError(
          "Please confirm your email address first. Check your inbox for the confirmation link.",
        );
      } else {
        setSubmitError(msg || "Login failed. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate>
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

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          value={form.password}
          error={errors.password}
          onChange={(e) => set("password", e.target.value)}
          autoComplete="current-password"
          required
        />
        <div className="text-right mt-1.5">
          <Link
            to="/reset-password"
            className="text-xs text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
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
        {loading || (attempted && authLoading) ? "Logging in..." : "Log In"}
      </Button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-primary font-medium hover:underline">
          Sign up free
        </Link>
      </p>
    </form>
  );
}
