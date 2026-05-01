export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className={`${sizes[size]} border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-2/5" />
        <div className="h-5 bg-gray-200 rounded-lg w-4/5" />
        <div className="h-4 bg-gray-200 rounded-lg w-2/4" />
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  )
}
