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
        "px-4 py-2",
        "font-medium",
        "bg-blue-600",
        "text-white",
        "hover:bg-blue-700",
        "transition",
        "disabled:opacity-50",
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}