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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u?.id).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      await fetchProfile(u?.id);
      setLoading(false);
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
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
