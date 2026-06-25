import { cn } from "../../utils/cn";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      {Icon && (
        <div className="w-16 h-16 bg-slate-800/60 border border-slate-700/60 rounded-2xl flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-slate-500" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action && action}
    </div>
  );
}
