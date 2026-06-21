import { cn } from "../../utils/cn";

export default function Button({
  children,
  className,
  loading,
  ...props
}) {
  return (
    <button
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-xl",
        "px-4 py-3.5",
        "font-semibold text-sm tracking-wide",
        "bg-white",
        "text-slate-950",
        "hover:bg-slate-100",
        "active:scale-[0.99]",
        "transform transition duration-150",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {loading ? (
        <svg 
          className="animate-spin h-5 w-5 text-current" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}