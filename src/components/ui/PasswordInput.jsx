import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  label,
  error,
  helperText,
  containerClassName = "",
  required = false,
  className = "",
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const id = props.id || props.name;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-dark">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          {...props}
          type={visible ? "text" : "password"}
          className={[
            "w-full px-4 py-3 pr-11 rounded-xl border text-dark text-sm",
            "bg-white placeholder:text-muted",
            "transition-all duration-200 outline-none",
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
              : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
            className,
          ].join(" ")}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="text-error text-xs">{error}</p>}
      {helperText && !error && <p className="text-muted text-xs">{helperText}</p>}
    </div>
  );
}
