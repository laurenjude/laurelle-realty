export default function Input({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  ...props
}) {
  const id = props.id || props.name

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-dark"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full px-4 py-3 rounded-xl border text-dark text-sm',
          'bg-white placeholder:text-muted',
          'transition-all duration-200 outline-none',
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-error text-xs">{error}</p>}
      {helperText && !error && <p className="text-muted text-xs">{helperText}</p>}
    </div>
  )
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  rows = 4,
  ...props
}) {
  const id = props.id || props.name

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={[
          'w-full px-4 py-3 rounded-xl border text-dark text-sm resize-none',
          'bg-white placeholder:text-muted',
          'transition-all duration-200 outline-none',
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-error text-xs">{error}</p>}
      {helperText && !error && <p className="text-muted text-xs">{helperText}</p>}
    </div>
  )
}

export function Select({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  children,
  ...props
}) {
  const id = props.id || props.name

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        className={[
          'w-full px-4 py-3 rounded-xl border text-dark text-sm cursor-pointer',
          'bg-white appearance-none',
          'transition-all duration-200 outline-none',
          error
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
            : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-error text-xs">{error}</p>}
      {helperText && !error && <p className="text-muted text-xs">{helperText}</p>}
    </div>
  )
}
