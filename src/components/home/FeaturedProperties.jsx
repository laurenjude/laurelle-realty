import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProperties } from '../../hooks/useProperties'
import PropertyCard from '../properties/PropertyCard'
import { PropertyCardSkeleton } from '../ui/LoadingSpinner'

export default function FeaturedProperties() {
  const { properties, loading, error } = useProperties({ featured: true }, 1)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
              Hand-Picked for You
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark">
              Featured Properties
            </h2>
            <p className="text-muted mt-3 max-w-md">
              Explore our curated selection of premium Lagos properties,
              verified and ready for viewings.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            View all properties
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {error ? (
          <div className="text-center py-16 text-muted">
            <p>Unable to load properties right now. Please try again later.</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p>No featured properties at the moment. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && properties.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
            >
              Browse All Properties
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
