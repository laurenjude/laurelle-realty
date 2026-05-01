import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { AuthProvider } from "./contexts/AuthContext";
import { SavedPropertiesProvider } from "./contexts/SavedPropertiesContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";

import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";

import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import SavedPropertiesPage from "./pages/dashboard/SavedPropertiesPage";
import ViewingsPage from "./pages/dashboard/ViewingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPropertiesPage from "./pages/admin/AdminPropertiesPage";
import AdminAddPropertyPage from "./pages/admin/AdminAddPropertyPage";
import AdminEditPropertyPage from "./pages/admin/AdminEditPropertyPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminInquiriesPage from "./pages/admin/AdminInquiriesPage";
import AdminViewingsPage from "./pages/admin/AdminViewingsPage";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <SavedPropertiesProvider>
            <Routes>
              {/* Public routes — Navbar + Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Auth routes — minimal layout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />

              {/* Buyer dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                <Route index element={<DashboardHomePage />} />
                <Route path="saved" element={<SavedPropertiesPage />} />
                <Route path="viewings" element={<ViewingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin panel */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                <Route index element={<AdminDashboardPage />} />
                <Route path="properties" element={<AdminPropertiesPage />} />
                <Route path="properties/new" element={<AdminAddPropertyPage />} />
                <Route path="properties/:id/edit" element={<AdminEditPropertyPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="inquiries" element={<AdminInquiriesPage />} />
                <Route path="viewings" element={<AdminViewingsPage />} />
              </Route>
            </Routes>
          </SavedPropertiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
