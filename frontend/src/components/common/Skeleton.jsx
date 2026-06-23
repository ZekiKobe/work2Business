export default function Skeleton({
  className = ""
}) {
  return (
    <div
      className={`
      animate-pulse
      rounded-xl
      bg-slate-900/60
      border border-slate-900/30
      ${className}
      `}
    />
  );
}