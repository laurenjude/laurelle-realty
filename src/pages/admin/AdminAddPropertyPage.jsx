import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PropertyForm from "../../components/admin/PropertyForm";

export default function AdminAddPropertyPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  async function handleSave(payload) {
    setSaving(true);
    const { error } = await supabase.from("properties").insert([payload]);
    setSaving(false);
    if (error) throw error;
    navigate("/admin/properties");
  }

  return (
    <>
      <Helmet>
        <title>Add Property — Admin | Laurelle Realty</title>
      </Helmet>

      <div className="max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/properties")}
            className="flex items-center gap-2 text-muted hover:text-dark text-sm mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to Properties
          </button>
          <h1 className="font-heading font-bold text-dark text-2xl sm:text-3xl mb-1">
            Add New Property
          </h1>
          <p className="text-muted">Fill in the details to list a new property.</p>
        </div>

        <PropertyForm
          onSave={handleSave}
          onCancel={() => navigate("/admin/properties")}
          loading={saving}
        />
      </div>
    </>
  );
}
