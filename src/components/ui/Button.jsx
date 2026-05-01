const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-light active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  accent: 'bg-accent text-white hover:bg-accent-dark active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white active:scale-95',
  'outline-accent': 'border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white active:scale-95',
  ghost: 'text-primary bg-transparent hover:bg-primary/10 active:scale-95',
  white: 'bg-white text-primary hover:bg-cream active:scale-95',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium font-body',
        'transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'outline-none',
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          Loading...
        </>
      ) : children}
    </button>
  )
}
