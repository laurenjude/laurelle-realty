import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PasswordResetForm from "../../components/auth/PasswordResetForm";

export default function PasswordResetPage() {
  return (
    <>
      <Helmet>
        <title>Reset Password — Laurelle Realty</title>
      </Helmet>

      <div className="min-h-screen bg-cream flex flex-col">
        <header className="py-5 px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Laurelle Realty"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-heading font-bold text-xl text-primary tracking-tight">
              Laurelle<span className="text-accent"> Realty</span>
            </span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-7">
                <h1 className="font-heading font-bold text-dark text-2xl mb-1">
                  Reset your password
                </h1>
                <p className="text-muted text-sm">
                  Enter your email and we will send you a reset link.
                </p>
              </div>
              <PasswordResetForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
