export default function ReviewStep({
  formData
}) {
  return (
    <div>

      <h2 className="text-xl font-bold mb-4">
        Review Information
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Name:</strong>{" "}
          {formData.firstName}
          {" "}
          {formData.lastName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {formData.email}
        </p>

        <p>
          <strong>Profession:</strong>{" "}
          {formData.profession}
        </p>

        <p>
          <strong>Employer:</strong>{" "}
          {formData.employer}
        </p>

        <p>
          <strong>Salary:</strong>{" "}
          {formData.monthlySalary}
        </p>

        <p>
          <strong>Capital:</strong>{" "}
          {formData.availableCapital}
        </p>

        <p>
          <strong>Skills:</strong>{" "}
          {formData.skills.join(", ")}
        </p>

        <p>
          <strong>Interests:</strong>{" "}
          {formData.interests.join(", ")}
        </p>

      </div>
    </div>
  );
}