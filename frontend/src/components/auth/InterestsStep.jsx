import { INTERESTS } from "../../constants/interests";

export default function InterestsStep({
  formData,
  setFormData
}) {

  const toggleInterest = (
    interest
  ) => {
    const exists =
      formData.interests.includes(
        interest
      );

    if (exists) {
      setFormData({
        ...formData,
        interests:
          formData.interests.filter(
            i => i !== interest
          )
      });
    } else {
      setFormData({
        ...formData,
        interests: [
          ...formData.interests,
          interest
        ]
      });
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-bold mb-2">
        Business Interests
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {INTERESTS.map(interest => (

          <div
            key={interest}
            onClick={() =>
              toggleInterest(
                interest
              )
            }
            className={`
              cursor-pointer
              p-4
              rounded-xl
              border

              ${
                formData.interests.includes(
                  interest
                )
                  ? "bg-blue-50 border-blue-600"
                  : "bg-white"
              }
            `}
          >
            {interest}
          </div>

        ))}

      </div>

    </div>
  );
}