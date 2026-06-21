export default function PageHeader({
  title,
  subtitle,
  actions
}) {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>

      {actions}
    </div>
  );
}