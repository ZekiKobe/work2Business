import toast from "react-hot-toast";

export function showUpgradeToast(message, navigate) {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 max-w-xs">
        <span className="text-sm text-slate-200">{message}</span>
        <button
          type="button"
          onClick={() => {
            navigate("/billing");
            toast.dismiss(t.id);
          }}
          className="text-left text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          Upgrade in Billing →
        </button>
      </div>
    ),
    { duration: 7000 }
  );
}
