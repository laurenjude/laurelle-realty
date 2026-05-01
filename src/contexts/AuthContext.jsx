import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracks whether INITIAL_SESSION has been processed this page load.
  // On refresh Supabase fires SIGNED_IN *before* INITIAL_SESSION — the
  // SIGNED_IN is an internal artifact and its profile fetch hangs due to
  // a Supabase client lock. We ignore it until INITIAL_SESSION arrives.
  const initialSessionHandledRef = useRef(false);

  // Dedup: prevents two concurrent profile fetches for the same user id.
  const fetchInFlightRef = useRef(null);

  // Fetch with one automatic retry after 1 s, 5 s timeout per attempt.
  async function fetchProfileWithRetry(userId, attempt = 1) {
    const profileQuery = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const timeoutGuard = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Profile fetch timed out after 5s")), 5000),
    );

    try {
      const { data, error } = await Promise.race([profileQuery, timeoutGuard]);
      if (error) throw error;
      return data;
    } catch (err) {
      if (attempt < 2) {
        console.log("[Auth] Retrying profile fetch in 1s...");
        await new Promise((r) => setTimeout(r, 1000));
        return fetchProfileWithRetry(userId, attempt + 1);
      }
      throw err;
    }
  }

  // Simple fetch used only by refreshProfile (user-initiated, no retry needed)
  async function fetchProfile(userId) {
    if (!userId) { setProfile(null); return null; }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data || null);
    return data;
  }

  // Safety net: if loading is still true after 8s, force it false
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

      // ── No user: clear everything ──────────────────────────────────
      if (!u) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        console.log("[Auth] Loading state set to false (no user)");
        return;
      }

      // ── SIGNED_IN before INITIAL_SESSION: refresh artifact, ignore ─
      // Supabase fires SIGNED_IN first on every page refresh. Its profile
      // fetch hangs (Supabase client lock) and would set loading=false with
      // profile=null before the cleaner INITIAL_SESSION fetch arrives.
      if (event === "SIGNED_IN" && !initialSessionHandledRef.current) {
        console.log("[Auth] Ignoring pre-INITIAL_SESSION SIGNED_IN (refresh artifact)");
        return;
      }

      // ── Mark INITIAL_SESSION ───────────────────────────────────────
      if (event === "INITIAL_SESSION") {
        initialSessionHandledRef.current = true;
        console.log("[Auth] INITIAL_SESSION event received, user:", u.id);
      }

      // ── TOKEN_REFRESHED: update user object only, profile unchanged ─
      if (event === "TOKEN_REFRESHED") {
        setUser(u);
        console.log("[Auth] Token refreshed — user updated, profile unchanged");
        return;
      }

      setUser(u);

      // ── Dedup: skip if already fetching for this user ──────────────
      if (fetchInFlightRef.current === u.id) {
        console.log("[Auth] Skipping duplicate profile fetch for", u.id);
        return;
      }

      fetchInFlightRef.current = u.id;
      console.log("[Auth] Fetching profile for user:", u.id);

      try {
        const data = await fetchProfileWithRetry(u.id);
        console.log("[Auth] Profile fetched successfully:", data?.full_name ?? "null");
        setProfile(data || null);
      } catch (err) {
        console.error("[Auth] Profile fetch error:", err.message);
        setProfile(null);
      } finally {
        fetchInFlightRef.current = null;
        setLoading(false);
        console.log("[Auth] Loading state set to false");
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
