import Card from "../ui/Card";

export default function StatCard({
  title,
  value,
  subtitle
}) {
  return (
    <Card>

      <p
        className="
        text-sm
        text-gray-500
        "
      >
        {title}
      </p>

      <h2
        className="
        text-3xl
        font-bold
        mt-2
        "
      >
        {value}
      </h2>

      <p
        className="
        text-sm
        mt-2
        text-gray-500
        "
      >
        {subtitle}
      </p>

    </Card>
  );
}