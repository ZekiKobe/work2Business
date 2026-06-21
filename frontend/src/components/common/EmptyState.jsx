import { FolderOpen } from "lucide-react";

export default function EmptyState({
  title,
  description
}) {
  return (
    <div
      className="
      text-center
      py-20
      "
    >
      <FolderOpen
        size={50}
        className="
        mx-auto
        text-slate-400
        "
      />

      <h3
        className="
        text-xl
        font-semibold
        mt-4
        "
      >
        {title}
      </h3>

      <p
        className="
        text-gray-500
        mt-2
        "
      >
        {description}
      </p>
    </div>
  );
}