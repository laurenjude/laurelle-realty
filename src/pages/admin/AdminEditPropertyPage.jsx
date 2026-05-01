import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import PropertyForm from "../../components/admin/PropertyForm";
import { PageLoader } from "../../components/ui/LoadingSpinner";

export default function AdminEditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) setFetchError("Property not found.");
        else setProperty(data);
        setFetching(false);
      });
  }, [id]);

  async function handleSave(payload) {
    setSaving(true);
    const { error } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", id);
    setSaving(false);
    if (error) throw error;
    navigate("/admin/properties");
  }

  if (fetching) return <PageLoader />;

  if (fetchError) {
    return (
      <div className="text-center py-20">
        <p className="text-error mb-4">{fetchError}</p>
        <button
          onClick={() => navigate("/admin/properties")}
          className="text-primary hover:underline text-sm">
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Property — Admin | Laurelle Realty</title>
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
            Edit Property
          </h1>
          <p className="text-muted truncate">{property?.title}</p>
        </div>

        <PropertyForm
          initialData={property}
          onSave={handleSave}
          onCancel={() => navigate("/admin/properties")}
          loading={saving}
        />
      </div>
    </>
  );
}
