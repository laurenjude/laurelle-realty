import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

const SavedPropertiesContext = createContext({
  savedIds: new Set(),
  toggle: async () => {},
  loading: false,
});

export function SavedPropertiesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    setLoading(true);
    supabase
      .from("saved_properties")
      .select("property_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setSavedIds(new Set((data || []).map((r) => r.property_id)));
        setLoading(false);
      });
  }, [user?.id]);

  async function toggle(propertyId) {
    if (!user) return false;

    const isSaved = savedIds.has(propertyId);

    // Optimistic update
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });

    try {
      if (isSaved) {
        await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);
      } else {
        await supabase
          .from("saved_properties")
          .insert([{ user_id: user.id, property_id: propertyId }]);
      }
    } catch {
      // Revert optimistic update on error
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (isSaved) next.add(propertyId);
        else next.delete(propertyId);
        return next;
      });
    }

    return !isSaved;
  }

  return (
    <SavedPropertiesContext.Provider value={{ savedIds, toggle, loading }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export function useSavedProperties() {
  return useContext(SavedPropertiesContext);
}
