import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    if (!userId) {
      setProfile(null);
      return null;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data || null);
    return data;
  }

  // Safety net: if loading is still true after 8s something is stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn("[Auth] Safety timeout — forcing loading false");
          return false;
        }
        return prev;
      });
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] State changed:", event, session?.user?.email ?? "no user");
      const u = session?.user ?? null;
      setUser(u);

      if (!u) {
        setProfile(null);
        setLoading(false);
        console.log("[Auth] Loading state set to false (no user)");
        return;
      }

      if (event === "INITIAL_SESSION") {
        console.log("[Auth] INITIAL_SESSION event received, user:", u.id);
      }

      console.log("[Auth] Fetching profile for user:", u.id);

      // On INITIAL_SESSION a fetch error often means the JWT hasn't been
      // refreshed yet — Supabase will fire TOKEN_REFRESHED momentarily and
      // retry. Keep loading=true in that case so ProtectedRoute never acts
      // on stale (null) profile data. For every other event we always finalize.
      let shouldFinalize = true;

      try {
        const profileQuery = supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single();

        const timeoutGuard = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Profile fetch timed out after 5s")), 5000),
        );

        const { data, error } = await Promise.race([profileQuery, timeoutGuard]);

        if (error) {
          console.error("[Auth] Profile fetch returned error:", error.message);
          setProfile(null);
          if (event === "INITIAL_SESSION") {
            shouldFinalize = false;
            console.log("[Auth] Deferring loading resolution — waiting for TOKEN_REFRESHED");
          }
        } else {
          console.log("[Auth] Profile fetched successfully:", data?.full_name ?? "null");
          setProfile(data || null);
        }
      } catch (err) {
        console.error("[Auth] Profile fetch error:", err.message);
        setProfile(null);
        if (event === "INITIAL_SESSION") {
          shouldFinalize = false;
          console.log("[Auth] Deferring loading resolution — waiting for TOKEN_REFRESHED");
        }
      } finally {
        if (shouldFinalize) {
          setLoading(false);
          console.log("[Auth] Loading state set to false");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp({ email, password, fullName, phone }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || "" } },
    });
    if (error) throw error;

    // If profile wasn't created by trigger yet, create it manually
    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email,
          full_name: fullName || "",
          phone: phone || "",
        },
        { onConflict: "id" },
      );
    }
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    console.log("[Auth] Signing out...");
    setUser(null);
    setProfile(null);
    setLoading(false);
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[Auth] Sign out error:", error);
    else console.log("[Auth] Sign out complete");
  }

  async function updateProfile(updates) {
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    refreshProfile: () => fetchProfile(user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
