import { cn } from "../../utils/cn";

export default function Skeleton({ className, lines = 1, ...props }) {
  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-800/80 rounded-lg animate-pulse ${i === lines - 1 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("h-4 bg-slate-800/80 rounded-lg animate-pulse", className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("glass rounded-2xl p-5 space-y-4 animate-pulse", className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-800 rounded w-1/3" />
          <div className="h-2 bg-slate-800/60 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800/60 rounded w-3/4" />
      </div>
    </div>
  );
}
