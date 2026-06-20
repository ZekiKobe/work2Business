import { useState } from "react";

import {
  Eye,
  EyeOff
} from "lucide-react";

export default function PasswordInput({
  label,
  value,
  onChange
}) {
  const [show, setShow] =
    useState(false);

  return (
    <div>

      <label
        className="
        block
        mb-2
        text-sm
        font-medium
      "
      >
        {label}
      </label>

      <div className="relative">

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          className="
          w-full
          border
          rounded-xl
          px-4
          py-3
          pr-12
          focus:ring-2
          focus:ring-blue-500
          outline-none
          "
        />

        <button
          type="button"
          onClick={() =>
            setShow(!show)
          }
          className="
          absolute
          right-3
          top-3
          "
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>

      </div>

    </div>
  );
}