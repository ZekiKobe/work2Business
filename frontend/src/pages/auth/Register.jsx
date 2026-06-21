import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

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
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          toast.error("Please complete all fields");
          return false;
        }
        break;
      case 2:
        if (!formData.profession || !formData.employer) {
          toast.error("Please provide employment information");
          return false;
        }
        break;
      case 3:
        if (!formData.monthlySalary || !formData.availableCapital) {
          toast.error("Please provide financial information");
          return false;
        }
        break;
      case 4:
        if (formData.skills.length === 0) {
          toast.error("Select at least one skill");
          return false;
        }
        break;
      case 5:
        if (formData.interests.length === 0) {
          toast.error("Select at least one interest");
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
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const previousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const submitRegistration = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        monthlySalary: Number(formData.monthlySalary),
        availableCapital: Number(formData.availableCapital),
      };

      await api.post("/auth/register", payload);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <PersonalInfoStep formData={formData} setFormData={setFormData} placeholders={{ firstName: "John", lastName: "Doe", email: "john@company.com", password: "••••••••" }} />;
      case 2: return <EmploymentStep formData={formData} setFormData={setFormData} placeholders={{ profession: "Software Engineer", employer: "Acme Corp" }} />;
      case 3: return <FinancialStep formData={formData} setFormData={setFormData} placeholders={{ monthlySalary: "5000", availableCapital: "25000" }} />;
      case 4: return <SkillsStep formData={formData} setFormData={setFormData} />;
      case 5: return <InterestsStep formData={formData} setFormData={setFormData} />;
      case 6: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans antialiased text-slate-200 selection:bg-indigo-500/30">

      {/* LEFT SIDE - BRAND SIDEBAR (Matches Login perfectly) */}
      <div className="hidden lg:flex w-[40%] bg-slate-900/40 border-r border-slate-800/60 p-16 relative overflow-hidden flex-col justify-between select-none">
        
        {/* Luxury Ambient Glows */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] -top-40 -left-40" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[110px] bottom-10 right-[-10%]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Brand/Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-lg tracking-wider">W</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Work2<span className="text-indigo-400">Business</span>
          </span>
        </div>

        {/* Dynamic Marketing Content */}
        <div className="relative z-10 my-auto max-w-sm">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-[1.2]">
            Build your setup <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              in simple steps.
            </span>
          </h1>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed font-light">
            We will analyze your professional attributes, current capacity, and initial capital structures to calibrate optimal entrepreneurship tracks.
          </p>
        </div>

        {/* Copyright */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60">
          <p className="text-xs text-slate-600 tracking-wide">
            © {new Date().getFullYear()} Work2Business Inc.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - MODERN DARK MULTI-STEP CARD */}
      <div className="w-full lg:w-[60%] flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        
        {/* Extra ambient light layer on the form side */}
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/[0.03] rounded-full blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="w-full max-w-[540px] relative z-10">
          
          {/* Mobile Logo Viewport fallback */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-white font-bold text-base">Work2Business</span>
          </div>

          {/* Core Slate Dashboard Card Wrapper */}
          <Card className="!bg-slate-900/60 !border !border-slate-800/80 !backdrop-blur-xl !shadow-2xl !rounded-2xl p-6 sm:p-10 space-y-7">
            
            {/* Context Heading */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Create Your Account
              </h1>
              <p className="text-slate-400 mt-2 text-sm font-light">
                Start your journey from employee to entrepreneur.
              </p>
            </div>

            {/* Stepper Interactive Module Container */}
            <div className="space-y-3 bg-slate-950/60 border border-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Setup Progress
                </span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2.5 py-1 rounded-md">
                  Step {step} of {TOTAL_STEPS}
                </span>
              </div>
              <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
            </div>

            {/* Injected Content Window */}
            <div className="min-h-[260px] flex flex-col justify-start pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="w-full text-slate-200"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Button Layout Row */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-800/80 gap-4">
              {step > 1 ? (
                <Button
                  type="button"
                  onClick={previousStep}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-sm transition flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm tracking-wide shadow-md transition flex items-center gap-1.5 active:scale-[0.98]"
                >
                  Next Step
                  <ChevronRight size={16} strokeWidth={2.5} />
                </Button>
              ) : (
                <Button
                  loading={loading}
                  onClick={submitRegistration}
                  className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  Complete Setup
                </Button>
              )}
            </div>

            {/* Alternative Action Footer Links */}
            <p className="text-center text-sm text-slate-500 pt-1">
              Already have an account?
              <Link to="/login" className="text-indigo-400 ml-1.5 font-semibold hover:text-indigo-300 transition">
                Sign In
              </Link>
            </p>

          </Card>
        </div>
      </div>

    </div>
  );
}