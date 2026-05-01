import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Bed, Bath, Maximize2, MapPin, Calendar, Tag,
  CheckCircle2, X, Phone, Mail, ChevronRight, Share2,
} from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import { supabase } from '../lib/supabase'
import PropertyGallery from '../components/properties/PropertyGallery'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import { PageLoader } from '../components/ui/LoadingSpinner'
import { formatPrice, formatDate, getListingLabel, getPropertyTypeLabel } from '../utils/formatters'

const AMENITY_ICONS = {
  pool: '🏊', gym: '🏋️', parking: '🅿️', security: '🔐',
  generator: '⚡', elevator: '🛗', balcony: '🌿', garden: '🌳',
  'air conditioning': '❄️', laundry: '🧺', internet: '📶', cctv: '📷',
  concierge: '🎩', playground: '🛝',
}

function AmenityBadge({ amenity }) {
  const icon = AMENITY_ICONS[amenity.toLowerCase()] || '✓'
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-cream rounded-xl text-sm text-dark">
      <span>{icon}</span>
      <span className="capitalize">{amenity}</span>
    </div>
  )
}

function InquiryModal({ property, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', message: `Hi, I'm interested in "${property.title}". Please get in touch.`,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
        property_id: property.id,
      }])
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: 'Failed to send enquiry. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:text-dark hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <h3 className="font-heading font-bold text-xl text-dark mb-2">Enquiry Sent!</h3>
            <p className="text-muted text-sm">
              We've received your enquiry and a consultant will contact you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-heading font-bold text-xl text-dark mb-1">
              Enquire About This Property
            </h3>
            <p className="text-muted text-sm mb-6">{property.title}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                name="name"
                label="Full Name"
                placeholder="Adaeze Okonkwo"
                required
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              <Input
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
              <Textarea
                name="message"
                label="Message"
                required
                rows={4}
                value={form.message}
                error={errors.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              />

              {errors.submit && (
                <p className="text-error text-sm bg-red-50 px-4 py-3 rounded-xl">{errors.submit}</p>
              )}

              <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full mt-1">
                Send Enquiry
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { property, loading, error } = useProperty(id)
  const [showInquiry, setShowInquiry] = useState(false)

  if (loading) return <PageLoader />

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-dark mb-3">Property Not Found</h2>
        <p className="text-muted mb-6">{error || 'This property may no longer be available.'}</p>
        <Link to="/properties" className="text-primary font-medium hover:underline">
          ← Back to Properties
        </Link>
      </div>
    )
  }

  const {
    title, description, price, listing_type, property_type,
    bedrooms, bathrooms, square_meters, location, city, state,
    amenities, images, status, featured, created_at,
  } = property

  return (
    <>
      <Helmet>
        <title>{title} — Laurelle Realty</title>
        <meta name="description" content={description?.slice(0, 160) || `${title} — ${location}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
          <ChevronRight size={14} />
          <span className="text-dark truncate">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <PropertyGallery images={images} title={title} />

            {/* Title & price (mobile) */}
            <div className="lg:hidden">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h1 className="font-heading text-2xl font-bold text-dark leading-tight">{title}</h1>
                <button
                  onClick={() => navigator.share?.({ title, url: window.location.href })}
                  className="p-2.5 border border-gray-200 rounded-xl text-muted hover:text-primary hover:border-primary transition-colors shrink-0"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-heading text-3xl font-bold text-primary">{formatPrice(price)}</span>
                {listing_type === 'rent' && <span className="text-muted text-sm">/year</span>}
              </div>
              <div className="flex items-center gap-1.5 text-muted text-sm">
                <MapPin size={14} className="text-accent" />
                <span>{location}, {city}, {state}</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: bedrooms ?? '--' },
                { icon: Bath, label: 'Bathrooms', value: bathrooms ?? '--' },
                { icon: Maximize2, label: 'Area', value: square_meters ? `${square_meters}m²` : '--' },
                { icon: Tag, label: 'Type', value: getPropertyTypeLabel(property_type) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-cream rounded-2xl p-4 text-center">
                  <Icon size={20} className="text-primary mx-auto mb-2" />
                  <p className="font-heading font-bold text-dark text-xl">{value}</p>
                  <p className="text-muted text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <div>
                <h2 className="font-heading font-bold text-xl text-dark mb-3">About This Property</h2>
                <p className="text-dark/80 leading-relaxed text-sm">{description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-xl text-dark mb-4">Amenities & Features</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => <AmenityBadge key={a} amenity={a} />)}
                </div>
              </div>
            )}

            {/* Map placeholder */}
            <div>
              <h2 className="font-heading font-bold text-xl text-dark mb-3">Location</h2>
              <div className="aspect-[16/7] bg-cream rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #0F4C3A 0px, #0F4C3A 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #0F4C3A 0px, #0F4C3A 1px, transparent 1px, transparent 40px)',
                  }}
                />
                <div className="text-center z-10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <MapPin size={22} className="text-white" />
                  </div>
                  <p className="font-medium text-dark">{location}</p>
                  <p className="text-muted text-sm mt-1">{city}, {state}</p>
                  <p className="text-xs text-muted mt-3 bg-white/60 px-3 py-1.5 rounded-full">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Price card (desktop) */}
            <div className="hidden lg:block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-bold text-primary">{formatPrice(price)}</span>
                    {listing_type === 'rent' && <span className="text-muted text-sm">/year</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted text-sm mt-1.5">
                    <MapPin size={13} className="text-accent" />
                    <span>{location}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigator.share?.({ title, url: window.location.href })}
                  className="p-2.5 border border-gray-200 rounded-xl text-muted hover:text-primary hover:border-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={15} />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${listing_type === 'rent' ? 'bg-blue-100 text-blue-600' : 'bg-accent/15 text-accent-dark'}`}>
                  {getListingLabel(listing_type)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/8 text-primary capitalize">
                  {getPropertyTypeLabel(property_type)}
                </span>
                {featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                    Featured
                  </span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <Button variant="primary" size="lg" className="w-full" onClick={() => setShowInquiry(true)}>
                  Book a Viewing
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={() => setShowInquiry(true)}>
                  Send Enquiry
                </Button>
              </div>

              {/* Contact info */}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                <a href="tel:+2341234567890" className="flex items-center gap-3 text-sm text-dark hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center">
                    <Phone size={14} className="text-primary" />
                  </div>
                  +234 123 456 7890
                </a>
                <a href="mailto:hello@laurellerealty.com" className="flex items-center gap-3 text-sm text-dark hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center">
                    <Mail size={14} className="text-primary" />
                  </div>
                  hello@laurellerealty.com
                </a>
              </div>

              {/* Listed date */}
              {created_at && (
                <p className="text-xs text-muted mt-4 text-center">
                  Listed {formatDate(created_at)}
                </p>
              )}
            </div>

            {/* Mobile CTA sticky bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setShowInquiry(true)}>
                Enquire
              </Button>
              <Button variant="primary" size="md" className="flex-1" onClick={() => setShowInquiry(true)}>
                Book Viewing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry modal */}
      {showInquiry && (
        <InquiryModal property={property} onClose={() => setShowInquiry(false)} />
      )}
    </>
  )
}
