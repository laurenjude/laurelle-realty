export function formatPrice(amount) {
  if (amount === null || amount === undefined) return '₦--'
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

export function formatArea(sqm) {
  if (!sqm) return '--'
  return `${Number(sqm).toLocaleString()} sqm`
}

export function formatDate(dateString) {
  if (!dateString) return '--'
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function truncateText(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trimEnd()}...`
}

export function getListingLabel(type) {
  return type === 'rent' ? 'For Rent' : 'For Sale'
}

export function getPropertyTypeLabel(type) {
  if (!type) return '--'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function getPriceLabel(price, listingType) {
  const formatted = formatPrice(price)
  return listingType === 'rent' ? `${formatted}/yr` : formatted
}
