export default function PlanSection({
  title,
  content
}) {
  return (
    <div className="mb-6">

      <h3 className="text-lg font-bold mb-2">
        {title}
      </h3>

      <div className="p-4 bg-white border rounded-xl">
        <pre className="whitespace-pre-wrap text-sm text-gray-700">
          {content}
        </pre>
      </div>

    </div>
  );
}