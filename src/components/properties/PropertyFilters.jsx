import { useState } from 'react'
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import Button from '../ui/Button'
import { Select } from '../ui/Input'

const LOCATIONS = [
  'Lekki Phase 1', 'Lekki Phase 2', 'Victoria Island', 'Ikoyi',
  'Ajah', 'Magodo', 'Ikeja GRA', 'Banana Island', 'Oniru',
  'Chevron', 'Sangotedo', 'Gbagada', 'Maryland', 'Surulere',
]

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'penthouse', label: 'Penthouse' },
]

const PRICE_RANGES = [
  { label: 'Under ₦10M', min: '', max: '10000000' },
  { label: '₦10M – ₦50M', min: '10000000', max: '50000000' },
  { label: '₦50M – ₦150M', min: '50000000', max: '150000000' },
  { label: '₦150M – ₦500M', min: '150000000', max: '500000000' },
  { label: 'Over ₦500M', min: '500000000', max: '' },
]

const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+']
const BATHROOM_OPTIONS = ['1', '2', '3', '4', '5+']

const EMPTY_FILTERS = {
  location: '', propertyType: '', listingType: '',
  minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '',
}

export default function PropertyFilters({ filters, onChange, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters || EMPTY_FILTERS)
  const [mobileOpen, setMobileOpen] = useState(false)

  function set(key, value) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  function handlePriceRange(e) {
    const val = e.target.value
    if (!val) {
      setLocalFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }))
      return
    }
    const range = PRICE_RANGES.find((r) => `${r.min}-${r.max}` === val)
    if (range) setLocalFilters((prev) => ({ ...prev, minPrice: range.min, maxPrice: range.max }))
  }

  const selectedPriceRange = PRICE_RANGES.find(
    (r) => r.min === localFilters.minPrice && r.max === localFilters.maxPrice
  )
  const priceRangeValue = selectedPriceRange
    ? `${selectedPriceRange.min}-${selectedPriceRange.max}`
    : ''

  function apply() {
    onApply?.(localFilters)
    setMobileOpen(false)
  }

  function reset() {
    setLocalFilters(EMPTY_FILTERS)
    onApply?.(EMPTY_FILTERS)
  }

  const hasActiveFilters = Object.values(localFilters).some(Boolean)

  const FilterPanel = () => (
    <div className="flex flex-col gap-5">
      {/* Listing type toggle */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Listing Type
        </p>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl">
          {[
            { label: 'All', value: '' },
            { label: 'For Sale', value: 'sale' },
            { label: 'For Rent', value: 'rent' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => set('listingType', value)}
              className={[
                'py-2 text-xs font-medium rounded-lg transition-all duration-200',
                localFilters.listingType === value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-dark',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Location
        </p>
        <select
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          value={localFilters.location}
          onChange={(e) => set('location', e.target.value)}
        >
          <option value="">Any Location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Property type */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Property Type
        </p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => set('propertyType', localFilters.propertyType === value ? '' : value)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200',
                localFilters.propertyType === value
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-muted hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Price Range
        </p>
        <select
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-dark bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          value={priceRangeValue}
          onChange={handlePriceRange}
        >
          <option value="">Any Price</option>
          {PRICE_RANGES.map((r) => (
            <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Bedrooms (Min)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => set('bedrooms', '')}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              !localFilters.bedrooms
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-200 text-muted hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            Any
          </button>
          {BEDROOM_OPTIONS.map((val) => (
            <button
              key={val}
              onClick={() => set('bedrooms', localFilters.bedrooms === val ? '' : val === '5+' ? '5' : val)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                localFilters.bedrooms === (val === '5+' ? '5' : val)
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-muted hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <p className="text-xs font-semibold text-dark uppercase tracking-widest mb-3">
          Bathrooms (Min)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => set('bathrooms', '')}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              !localFilters.bathrooms
                ? 'bg-primary border-primary text-white'
                : 'bg-white border-gray-200 text-muted hover:border-primary hover:text-primary',
            ].join(' ')}
          >
            Any
          </button>
          {BATHROOM_OPTIONS.map((val) => (
            <button
              key={val}
              onClick={() => set('bathrooms', localFilters.bathrooms === val ? '' : val === '5+' ? '5' : val)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                localFilters.bathrooms === (val === '5+' ? '5' : val)
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-200 text-muted hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={reset}
          disabled={!hasActiveFilters}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-muted hover:text-dark border border-gray-200 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={13} />
          Reset
        </button>
        <Button variant="primary" size="sm" className="flex-1" onClick={apply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-dark hover:border-primary transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal size={15} className="text-primary" />
        Filters
        {hasActiveFilters && (
          <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
            {Object.values(localFilters).filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading font-semibold text-dark">Filter Properties</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-semibold text-dark flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="text-xs text-muted hover:text-error flex items-center gap-1 transition-colors"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>
        <FilterPanel />
      </div>
    </>
  )
}
