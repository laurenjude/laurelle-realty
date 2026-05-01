import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import useAuth from "./useAuth";

export default function useViewings() {
  const { user } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchViewings = useCallback(async () => {
    if (!user) {
      setViewings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from("viewings")
      .select("*, properties(id, title, location, images)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setViewings(data || []);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchViewings();
  }, [fetchViewings]);

  async function createViewing({ propertyId, date, time, notes }) {
    const { data, error: err } = await supabase
      .from("viewings")
      .insert([
        {
          user_id: user.id,
          property_id: propertyId,
          preferred_date: date,
          preferred_time: time,
          notes: notes || null,
          status: "pending",
        },
      ])
      .select("*, properties(id, title, location, images)")
      .single();

    if (err) throw err;
    setViewings((prev) => [data, ...prev]);
    return data;
  }

  async function cancelViewing(viewingId) {
    const { error: err } = await supabase
      .from("viewings")
      .update({ status: "cancelled" })
      .eq("id", viewingId)
      .eq("user_id", user.id);

    if (err) throw err;
    setViewings((prev) =>
      prev.map((v) => (v.id === viewingId ? { ...v, status: "cancelled" } : v)),
    );
  }

  return { viewings, loading, error, createViewing, cancelViewing, refetch: fetchViewings };
}
