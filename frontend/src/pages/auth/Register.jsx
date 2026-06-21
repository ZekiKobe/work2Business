import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Stepper from "../../components/ui/Stepper";

import PersonalInfoStep from "../../components/auth/PersonalInfoStep";
import EmploymentStep from "../../components/auth/EmploymentStep";
import FinancialStep from "../../components/auth/FinancialStep";
import SkillsStep from "../../components/auth/SkillsStep";
import InterestsStep from "../../components/auth/InterestsStep";
import ReviewStep from "../../components/auth/ReviewStep";

import api from "../../api/axios";

const TOTAL_STEPS = 6;

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",

    profession: "",
    employer: "",

    monthlySalary: "",
    availableCapital: "",

    skills: [],
    interests: [],
  });

  const validateStep = () => {
    switch (step) {
      case 1:
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password
        ) {
          toast.error(
            "Please complete all fields"
          );
          return false;
        }
        break;

      case 2:
        if (
          !formData.profession ||
          !formData.employer
        ) {
          toast.error(
            "Please provide employment information"
          );
          return false;
        }
        break;

      case 3:
        if (
          !formData.monthlySalary ||
          !formData.availableCapital
        ) {
          toast.error(
            "Please provide financial information"
          );
          return false;
        }
        break;

      case 4:
        if (formData.skills.length === 0) {
          toast.error(
            "Select at least one skill"
          );
          return false;
        }
        break;

      case 5:
        if (
          formData.interests.length === 0
        ) {
          toast.error(
            "Select at least one interest"
          );
          return false;
        }
        break;

      default:
        break;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitRegistration =
    async () => {
      try {
        setLoading(true);

        const payload = {
          ...formData,
          monthlySalary: Number(
            formData.monthlySalary
          ),
          availableCapital: Number(
            formData.availableCapital
          ),
        };

        await api.post(
          "/auth/register",
          payload
        );

        toast.success(
          "Account created successfully"
        );

        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 2:
        return (
          <EmploymentStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 3:
        return (
          <FinancialStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 4:
        return (
          <SkillsStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 5:
        return (
          <InterestsStep
            formData={formData}
            setFormData={setFormData}
          />
        );

      case 6:
        return (
          <ReviewStep
            formData={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <Card className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="text-gray-500 mt-2">
            Start your journey from
            employee to entrepreneur
          </p>
        </div>

        <Stepper
          currentStep={step}
          totalSteps={TOTAL_STEPS}
        />

        <div className="text-sm text-gray-500">
          Step {step} of {TOTAL_STEPS}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -30,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between">

          {step > 1 ? (
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600"
              onClick={previousStep}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={nextStep}
            >
              Next
            </Button>
          ) : (
            <Button
              loading={loading}
              onClick={
                submitRegistration
              }
            >
              Create Account
            </Button>
          )}

        </div>

      </Card>
    </AuthLayout>
  );
}