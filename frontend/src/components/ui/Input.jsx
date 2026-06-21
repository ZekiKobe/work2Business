import { cn } from "../../utils/cn";

export default function Input({
  label,
  type = "text",
  error,
  className,
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          type={type}
          {...props}
          className={cn(
            "w-full",
            "!h-12",
            "rounded-xl",
            "border",
            "px-4",
            "text-sm",
            "text-white", // <--- Force typing text to be pure white
            "placeholder:text-slate-500", // <--- Clean muted placeholder
            "bg-slate-900", // <--- Dark input background
            "outline-none",
            "transition-all",
            "duration-200",
            "box-border",
            error
              ? "!border-red-500/50 focus:!border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "!border-slate-800 hover:!border-slate-700 focus:!border-indigo-500 focus:ring-4 focus:ring-indigo-500/10",
            className
          )}
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}