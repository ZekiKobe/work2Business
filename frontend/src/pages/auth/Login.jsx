import {
  useState,
  useContext
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PasswordInput from "../../components/ui/PasswordInput";

import api from "../../api/axios";

import {
  AuthContext
} from "../../context/AuthContext";

export default function Login() {

  const navigate =
    useNavigate();

  const { login } =
    useContext(AuthContext);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await api.post(
            "/auth/login",
            formData
          );

        login(response.data);

        toast.success(
          "Welcome back!"
        );

        navigate("/");
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <AuthLayout>

      <Card className="space-y-6">

        <div>

          <h1
            className="
            text-3xl
            font-bold
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            text-gray-500
            mt-2
          "
          >
            Login to continue
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <Input
            label="Email"
            type="email"
            value={
              formData.email
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                email:
                  e.target.value
              })
            }
          />

          <PasswordInput
            label="Password"
            value={
              formData.password
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                password:
                  e.target.value
              })
            }
          />

          <div
            className="
            flex
            justify-between
            items-center
            "
          >

            <label
              className="
              flex
              items-center
              gap-2
              "
            >
              <input
                type="checkbox"
              />

              Remember Me
            </label>

            <button
              type="button"
              className="
              text-blue-600
              "
            >
              Forgot Password?
            </button>

          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Login
          </Button>

        </form>

        <div
          className="
          text-center
          text-sm
          "
        >

          Don't have an account?

          <Link
            to="/register"
            className="
            text-blue-600
            ml-2
            "
          >
            Register
          </Link>

        </div>

      </Card>

    </AuthLayout>
  );
}