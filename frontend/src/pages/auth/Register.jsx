import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", formData);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md border rounded-lg p-6 shadow">

        <h1 className="text-2xl font-bold mb-6">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            name="firstName"
            placeholder="First Name"
            className="border w-full p-2 mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            className="border w-full p-2 mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border w-full p-2 mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="border w-full p-2 mb-4"
            onChange={handleChange}
            required
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-2 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        <p className="mt-4">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}