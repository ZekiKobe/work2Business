export default function Stepper({
  currentStep,
  totalSteps
}) {
  return (
    <div className="flex gap-2">
      {[...Array(totalSteps)].map(
        (_, index) => (
          <div
            key={index}
            className={`
              h-2
              flex-1
              rounded-full
              ${
                index + 1 <= currentStep
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }
            `}
          />
        )
      )}
    </div>
  );
}