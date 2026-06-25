export default function Stepper({
  currentStep,
  totalSteps
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      {[...Array(totalSteps)].map(
        (_, index) => {
          const isActive = index + 1 <= currentStep;
          
          return (
            <div
              key={index}
              className={`
                h-1.5
                flex-1
                rounded-full
                transition-all
                duration-300
                ${
                  isActive
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    : "bg-slate-900"
                }
              `}
            />
          );
        }
      )}
    </div>
  );
}