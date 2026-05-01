import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2
            size={28}
            className="text-success"
          />
        </div>
        <h3 className="font-heading font-bold text-dark text-xl mb-2">Email sent!</h3>
        <p className="text-muted text-sm mb-6 max-w-xs mx-auto">
          Check your inbox for a password reset link. It may take a minute to arrive.
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
      <p className="text-muted text-sm">
        Enter your email address and we will send you a link to reset your password.
      </p>

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        error={error}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
        }}
        autoComplete="email"
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading}
        className="w-full">
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link
          to="/login"
          className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
