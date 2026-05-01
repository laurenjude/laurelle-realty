import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronLeft, ChevronRight, LayoutGrid, List, SortAsc } from 'lucide-react'
import { useProperties } from '../hooks/useProperties'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'
import { PropertyCardSkeleton } from '../components/ui/LoadingSpinner'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

function buildFiltersFromParams(params) {
  return {
    location: params.get('location') || '',
    propertyType: params.get('type') || '',
    listingType: params.get('listingType') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    bedrooms: params.get('bedrooms') || '',
    bathrooms: params.get('bathrooms') || '',
    sortBy: params.get('sortBy') || '',
  }
}

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('newest')

  const [activeFilters, setActiveFilters] = useState(() =>
    buildFiltersFromParams(searchParams)
  )

  // Sync URL → filters on first load
  useEffect(() => {
    setActiveFilters(buildFiltersFromParams(searchParams))
  }, []) // intentional: only on mount

  const filters = { ...activeFilters, sortBy: sort }
  const { properties, loading, error, totalCount, totalPages } = useProperties(filters, page)

  function handleFiltersApply(newFilters) {
    setActiveFilters(newFilters)
    setPage(1)
    // Update URL params so the link is shareable
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v) })
    setSearchParams(params, { replace: true })
  }

  function handleSort(val) {
    setSort(val)
    setPage(1)
  }

  const start = (page - 1) * 12 + 1
  const end = Math.min(page * 12, totalCount)

  return (
    <>
      <Helmet>
        <title>Browse Properties — Laurelle Realty</title>
        <meta
          name="description"
          content="Browse premium residential properties for sale and rent in Lagos. Filter by location, type, price, and more."
        />
      </Helmet>

      {/* Page header */}
      <div className="bg-cream border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark">
            Properties in Lagos
          </h1>
          <p className="text-muted mt-1 text-sm">
            {loading
              ? 'Searching...'
              : `${totalCount.toLocaleString()} propert${totalCount === 1 ? 'y' : 'ies'} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-4">
          <PropertyFilters
            filters={activeFilters}
            onApply={handleFiltersApply}
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <PropertyFilters
              filters={activeFilters}
              onApply={handleFiltersApply}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort & count bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted">
                {!loading && totalCount > 0 && (
                  <>Showing <span className="text-dark font-medium">{start}–{end}</span> of <span className="text-dark font-medium">{totalCount.toLocaleString()}</span></>
                )}
              </p>
              <div className="flex items-center gap-2">
                <SortAsc size={15} className="text-muted" />
                <select
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-dark outline-none focus:border-primary cursor-pointer"
                  value={sort}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-error rounded-xl p-6 text-center">
                <p className="font-medium">Something went wrong</p>
                <p className="text-sm mt-1 opacity-80">{error}</p>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && properties.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid size={24} className="text-muted" />
                </div>
                <h3 className="font-heading font-semibold text-dark text-lg mb-2">No properties found</h3>
                <p className="text-muted text-sm max-w-xs mx-auto">
                  Try adjusting your filters or broadening your search criteria.
                </p>
              </div>
            )}

            {/* Properties grid */}
            {!loading && !error && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-dark hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1
                    if (
                      p === 1 || p === totalPages ||
                      (p >= page - 1 && p <= page + 1)
                    ) {
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={[
                            'w-9 h-9 rounded-xl text-sm font-medium transition-all',
                            p === page
                              ? 'bg-primary text-white'
                              : 'text-muted hover:text-dark hover:bg-gray-50',
                          ].join(' ')}
                        >
                          {p}
                        </button>
                      )
                    }
                    if (p === page - 2 || p === page + 2) {
                      return <span key={p} className="text-muted px-1">…</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl text-dark hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
