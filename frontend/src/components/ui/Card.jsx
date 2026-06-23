export default function Card({
  children,
  className = ""
}) {
  return (
    <div
      className={`
      bg-slate-900/60
      backdrop-blur-md
      border
      border-slate-800/80
      rounded-2xl
      shadow-xl
      p-6
      transition-all
      duration-200
      ${className}
    `}
    >
      {children}
    </div>
  );
}