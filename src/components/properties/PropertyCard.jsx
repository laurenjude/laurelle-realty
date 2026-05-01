import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react'
import { formatPrice, getListingLabel, getPropertyTypeLabel } from '../../utils/formatters'
import SavePropertyButton from './SavePropertyButton'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=70&auto=format&fit=crop'

export default function PropertyCard({ property }) {
  const {
    id, title, price, property_type, listing_type,
    bedrooms, bathrooms, square_meters, location, images, featured, status,
  } = property

  const mainImage = images?.[0] || FALLBACK_IMAGE

  return (
    <Link
      to={`/properties/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE }}
        />

        {/* Status overlay for non-available */}
        {status && status !== 'available' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-dark font-semibold text-sm px-4 py-1.5 rounded-full uppercase tracking-wide">
              {status}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={[
              'px-2.5 py-1 rounded-full text-xs font-semibold',
              listing_type === 'rent'
                ? 'bg-blue-500 text-white'
                : 'bg-accent text-white',
            ].join(' ')}
          >
            {getListingLabel(listing_type)}
          </span>
          {featured && (
            <span className="px-2.5 py-1 bg-primary text-white rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Save button */}
        <div className="absolute top-3 right-3">
          <SavePropertyButton propertyId={id} size={15} />
        </div>

        {/* Property type chip */}
        {property_type && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white rounded-lg text-xs font-medium capitalize">
              {getPropertyTypeLabel(property_type)}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="font-heading font-bold text-xl text-primary">
            {formatPrice(price)}
          </span>
          {listing_type === 'rent' && (
            <span className="text-muted text-xs font-normal">/year</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-dark text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted text-sm mb-4">
          <MapPin size={13} className="shrink-0 text-accent" />
          <span className="truncate">{location}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Property details */}
        <div className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <Bed size={14} className="text-primary/60" />
            <span>{bedrooms ?? '--'} Beds</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Bath size={14} className="text-primary/60" />
            <span>{bathrooms ?? '--'} Baths</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Maximize2 size={14} className="text-primary/60" />
            <span>{square_meters ? `${square_meters}m²` : '--'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
