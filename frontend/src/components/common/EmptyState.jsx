import { FolderOpen } from "lucide-react";

export default function EmptyState({
  title,
  description
}) {
  return (
    <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-dashed border-slate-900/80 p-8 backdrop-blur-sm">
      
      {/* ICON CONTEXT LAYER */}
      <div className="inline-flex p-3 bg-slate-950 rounded-xl border border-slate-900 shadow-inner mb-4">
        <FolderOpen
          size={36}
          className="text-slate-500 animate-pulse"
        />
      </div>

      {/* HEADER TITLE */}
      <h3 className="text-base font-bold text-slate-200 tracking-tight">
        {title}
      </h3>

      {/* DESCRIPTION BRIEF */}
      <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      
    </div>
  );
}