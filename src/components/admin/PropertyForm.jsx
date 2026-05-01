import { useState, useRef } from "react";
import { Upload, X, AlertCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabase";
import Input, { Textarea, Select } from "../ui/Input";
import Button from "../ui/Button";

const PROPERTY_TYPES = ["apartment", "house", "duplex", "bungalow", "penthouse"];
const LISTING_TYPES = ["sale", "rent"];
const STATUSES = ["available", "sold", "rented"];
const LOCATIONS = [
  "Lekki Phase 1",
  "Victoria Island",
  "Ikoyi",
  "Ajah",
  "Magodo",
  "Ikeja GRA",
  "Banana Island",
  "Oniru",
  "Chevron",
  "Sangotedo",
];
const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gym / Fitness Center",
  "Parking Space",
  "24/7 Security",
  "Generator / Backup Power",
  "CCTV Surveillance",
  "Air Conditioning",
  "Furnished",
  "Water Supply",
  "Boys Quarters",
  "Garden / Yard",
  "Balcony",
  "Elevator / Lift",
  "Smart Home",
  "Solar Power",
  "Internet / WiFi",
];

function buildInitialForm(data) {
  return {
    title: data?.title || "",
    description: data?.description || "",
    price: data?.price || "",
    listing_type: data?.listing_type || "",
    property_type: data?.property_type || "",
    location: data?.location || "",
    bedrooms: data?.bedrooms ?? "",
    bathrooms: data?.bathrooms ?? "",
    square_meters: data?.square_meters ?? "",
    featured: data?.featured || false,
    status: data?.status || "available",
    amenities: data?.amenities || [],
    images: data?.images || [],
  };
}

export default function PropertyForm({ initialData, onSave, onCancel, loading: saving }) {
  const [form, setForm] = useState(() => buildInitialForm(initialData));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    if (submitError) setSubmitError("");
  }

  function toggleAmenity(amenity) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const newUrls = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
    }

    setForm((prev) => ({ ...prev, images: [...prev.images, ...newUrls] }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Valid price is required";
    if (!form.listing_type) errs.listing_type = "Select a listing type";
    if (!form.property_type) errs.property_type = "Select a property type";
    if (!form.location.trim()) errs.location = "Location is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      listing_type: form.listing_type,
      property_type: form.property_type,
      location: form.location.trim(),
      bedrooms: form.bedrooms !== "" ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms !== "" ? Number(form.bathrooms) : null,
      square_meters: form.square_meters !== "" ? Number(form.square_meters) : null,
      featured: form.featured,
      status: form.status,
      amenities: form.amenities,
      images: form.images,
    };

    try {
      await onSave(payload);
    } catch (err) {
      setSubmitError(err?.message || "Failed to save property. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      noValidate>
      {/* Basic info */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="font-heading font-semibold text-dark text-lg mb-5">
          Basic Information
        </h2>
        <div className="space-y-5">
          <Input
            label="Property Title"
            placeholder="e.g. Stunning 4-Bedroom Duplex in Lekki Phase 1"
            value={form.title}
            error={errors.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Select
              label="Listing Type"
              value={form.listing_type}
              error={errors.listing_type}
              onChange={(e) => set("listing_type", e.target.value)}
              required>
              <option value="">Select type</option>
              {LISTING_TYPES.map((t) => (
                <option
                  key={t}
                  value={t}>
                  {t === "sale" ? "For Sale" : "For Rent"}
                </option>
              ))}
            </Select>

            <Select
              label="Property Type"
              value={form.property_type}
              error={errors.property_type}
              onChange={(e) => set("property_type", e.target.value)}
              required>
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option
                  key={t}
                  value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Price (₦)"
              type="number"
              placeholder="e.g. 85000000"
              value={form.price}
              error={errors.price}
              onChange={(e) => set("price", e.target.value)}
              min="0"
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Location
              </label>
              <input
                list="locations-list"
                placeholder="e.g. Lekki Phase 1"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className={[
                  "w-full px-4 py-3 rounded-xl border text-sm text-dark bg-gray-50 outline-none transition-all duration-200",
                  "focus:bg-white focus:ring-2",
                  errors.location
                    ? "border-error focus:ring-error/20 focus:border-error"
                    : "border-gray-200 focus:ring-primary/15 focus:border-primary",
                ].join(" ")}
              />
              <datalist id="locations-list">
                {LOCATIONS.map((l) => (
                  <option
                    key={l}
                    value={l}
                  />
                ))}
              </datalist>
              {errors.location && (
                <p className="mt-1 text-xs text-error">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Bedrooms"
              type="number"
              placeholder="e.g. 4"
              value={form.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
              min="0"
            />
            <Input
              label="Bathrooms"
              type="number"
              placeholder="e.g. 3"
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
              min="0"
            />
            <Input
              label="Size (m&#178;)"
              type="number"
              placeholder="e.g. 350"
              value={form.square_meters}
              onChange={(e) => set("square_meters", e.target.value)}
              min="0"
            />
          </div>

          <Textarea
            label="Description"
            placeholder="Describe the property in detail..."
            value={form.description}
            rows={5}
            onChange={(e) => set("description", e.target.value)}
          />

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20"
            />
            <div>
              <span className="text-sm font-medium text-dark group-hover:text-primary transition-colors">
                Mark as Featured
              </span>
              <p className="text-xs text-muted">
                Featured properties appear on the homepage
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="font-heading font-semibold text-dark text-lg mb-5">
          Property Images
        </h2>

        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/2 transition-colors"
          onClick={() => fileRef.current?.click()}>
          <ImageIcon
            size={32}
            className="text-muted mx-auto mb-3"
          />
          <p className="text-sm font-medium text-dark mb-1">
            Click to upload images
          </p>
          <p className="text-xs text-muted">JPG, PNG, WebP up to 10MB each</p>
          {uploading && (
            <p className="text-xs text-primary mt-2 animate-pulse">Uploading...</p>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {form.images.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                  src={url}
                  alt={`Property image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                    Main
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted mt-3">
          First image will be used as the main display photo. Drag to reorder.
        </p>
      </section>

      {/* Amenities */}
      <section className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="font-heading font-semibold text-dark text-lg mb-5">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {AMENITIES_OPTIONS.map((amenity) => {
            const checked = form.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={[
                  "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-sm",
                  checked
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-dark hover:border-primary/40",
                ].join(" ")}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20 shrink-0"
                />
                <span className="truncate">{amenity}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Error + actions */}
      {submitError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-error rounded-xl px-4 py-3">
          <AlertCircle
            size={16}
            className="shrink-0 mt-0.5"
          />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={saving}
          disabled={saving || uploading}>
          {saving ? "Saving..." : initialData ? "Update Property" : "Create Property"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onCancel}
          disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
