import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";

const NIGERIAN_PHONE_RE = /^(\+234|0)[0-9]{10}$/;

export default function ProfilePage() {
  const { profile, updateProfile, updatePassword } = useAuth();

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [pwForm, setPwForm] = useState({ newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function setP(key, val) {
    setProfileForm((prev) => ({ ...prev, [key]: val }));
    if (profileErrors[key]) setProfileErrors((prev) => ({ ...prev, [key]: "" }));
    if (profileError) setProfileError("");
    if (profileSuccess) setProfileSuccess(false);
  }

  function setPw(key, val) {
    setPwForm((prev) => ({ ...prev, [key]: val }));
    if (pwErrors[key]) setPwErrors((prev) => ({ ...prev, [key]: "" }));
    if (pwError) setPwError("");
    if (pwSuccess) setPwSuccess(false);
  }

  function validateProfile() {
    const errs = {};
    if (!profileForm.full_name.trim()) errs.full_name = "Name is required";
    else if (profileForm.full_name.trim().length < 2)
      errs.full_name = "Name must be at least 2 characters";
    const phone = profileForm.phone.trim().replace(/\s/g, "");
    if (phone && !NIGERIAN_PHONE_RE.test(phone))
      errs.phone = "Enter a valid Nigerian number, e.g. 08012345678";
    return errs;
  }

  function validatePassword() {
    const errs = {};
    if (!pwForm.newPassword) errs.newPassword = "New password is required";
    else if (!/^(?=.*[0-9]).{8,}$/.test(pwForm.newPassword))
      errs.newPassword = "Minimum 8 characters with at least 1 number";
    if (!pwForm.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) {
      setProfileErrors(errs);
      return;
    }
    setProfileSaving(true);
    try {
      await updateProfile({
        full_name: profileForm.full_name.trim(),
        phone: profileForm.phone.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err) {
      setProfileError(err?.message || "Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    const errs = validatePassword();
    if (Object.keys(errs).length) {
      setPwErrors(errs);
      return;
    }
    setPwSaving(true);
    try {
      await updatePassword(pwForm.newPassword);
      setPwSuccess(true);
      setPwForm({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err?.message || "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Profile — Laurelle Realty</title>
      </Helmet>

      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            My Profile
          </h1>
          <p className="text-muted">Manage your personal information and password.</p>
        </div>

        {/* Avatar + email */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-dark">{profile?.full_name || "—"}</p>
            <p className="text-muted text-sm">{profile?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
              {profile?.role || "buyer"}
            </span>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-heading font-semibold text-dark text-lg mb-5">
            Personal Information
          </h2>

          <form
            onSubmit={handleProfileSave}
            className="space-y-5"
            noValidate>
            <Input
              label="Full Name"
              placeholder="Adaeze Okonkwo"
              value={profileForm.full_name}
              error={profileErrors.full_name}
              onChange={(e) => setP("full_name", e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profile?.email || ""}
              readOnly
              helperText="Email cannot be changed"
              className="opacity-60 cursor-not-allowed"
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="08012345678 or +2348012345678"
              value={profileForm.phone}
              error={profileErrors.phone}
              helperText="Optional — Nigerian format"
              onChange={(e) => setP("phone", e.target.value)}
            />

            {profileSuccess && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 size={16} />
                Profile updated successfully!
              </div>
            )}
            {profileError && (
              <div className="flex items-start gap-2 text-error text-sm">
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                />
                {profileError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={profileSaving}
              disabled={profileSaving}>
              {profileSaving ? "Saving..." : "Update Profile"}
            </Button>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-heading font-semibold text-dark text-lg mb-5">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5"
            noValidate>
            <PasswordInput
              label="New Password"
              name="newPassword"
              placeholder="Min. 8 characters + 1 number"
              value={pwForm.newPassword}
              error={pwErrors.newPassword}
              onChange={(e) => setPw("newPassword", e.target.value)}
              autoComplete="new-password"
              required
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Repeat your new password"
              value={pwForm.confirmPassword}
              error={pwErrors.confirmPassword}
              onChange={(e) => setPw("confirmPassword", e.target.value)}
              autoComplete="new-password"
              required
            />

            {pwSuccess && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 size={16} />
                Password updated successfully!
              </div>
            )}
            {pwError && (
              <div className="flex items-start gap-2 text-error text-sm">
                <AlertCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                />
                {pwError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={pwSaving}
              disabled={pwSaving}>
              {pwSaving ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
