import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          {...props}
          className={`
            w-full
            !h-12
            rounded-xl
            border
            px-4
            pr-12
            text-sm
            text-white
            placeholder:text-slate-500
            bg-slate-900
            outline-none
            transition-all
            duration-200
            box-border
            ${error 
              ? '!border-red-500/50 focus:!border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : '!border-slate-800 hover:!border-slate-700 focus:!border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }
          `}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-500
            hover:text-slate-300
            transition-colors
            duration-150
            focus:outline-none
          "
        >
          {show ? (
            <EyeOff size={18} strokeWidth={2} />
          ) : (
            <Eye size={18} strokeWidth={2} />
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-xs font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}