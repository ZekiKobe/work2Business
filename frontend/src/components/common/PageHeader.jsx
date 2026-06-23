export default function PageHeader({
  title,
  subtitle,
  actions
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-5 border-b border-slate-900">

      <div>
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>

        {/* SUBTITLE */}
        {subtitle && (
          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* HEADER ACTIONS STACK */}
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}