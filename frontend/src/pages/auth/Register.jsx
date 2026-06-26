import { useContext, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, CheckCircle2, Building2 } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

import PersonalInfoStep from "../../components/auth/PersonalInfoStep";
import EmploymentStep from "../../components/auth/EmploymentStep";
import FinancialStep from "../../components/auth/FinancialStep";
import SkillsStep from "../../components/auth/SkillsStep";
import InterestsStep from "../../components/auth/InterestsStep";
import ReviewStep from "../../components/auth/ReviewStep";
import { PLANS } from "../../constants/plans";

const STEPS = [
  { id: 1, label: "Personal" },
  { id: 2, label: "Employment" },
  { id: 3, label: "Financial" },
  { id: 4, label: "Skills" },
  { id: 5, label: "Interests" },
  { id: 6, label: "Review" }
];

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  profession: "",
  employer: "",
  monthlySalary: "",
  availableCapital: "",
  availableHoursPerWeek: "",
  skills: [],
  interests: []
};

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") === "founder" ? "founder" : "starter";
  const planInfo = PLANS[selectedPlan];
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => api.post("/auth/register", payload),
    onSuccess: (res) => {
      login(res.data);
      toast.success("Welcome to Work2Business! Let's build your future.");
      if (selectedPlan === "founder") {
        navigate("/checkout?plan=founder");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  });

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) { toast.error("First name is required"); return false; }
        if (!formData.lastName.trim()) { toast.error("Last name is required"); return false; }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) { toast.error("Valid email is required"); return false; }
        if (!formData.password || formData.password.length < 8) { toast.error("Password must be at least 8 characters"); return false; }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          toast.error("Password must include an uppercase letter, a lowercase letter, and a number");
          return false;
        }
        break;
      case 2:
        if (!formData.profession.trim()) { toast.error("Profession is required"); return false; }
        break;
      case 3:
        if (!formData.availableHoursPerWeek || Number(formData.availableHoursPerWeek) < 1) {
          toast.error("Please enter your available hours per week"); return false;
        }
        break;
      case 4:
        if (formData.skills.length === 0) { toast.error("Select at least one skill"); return false; }
        break;
      case 5:
        if (formData.interests.length === 0) { toast.error("Select at least one interest"); return false; }
        break;
      default:
        break;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 6)); };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = () => {
    mutate({
      ...formData,
      selectedPlan,
      monthlySalary: Number(formData.monthlySalary) || 0,
      availableCapital: Number(formData.availableCapital) || 0,
      availableHoursPerWeek: Number(formData.availableHoursPerWeek) || 0
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <PersonalInfoStep formData={formData} setFormData={setFormData} />;
      case 2: return <EmploymentStep formData={formData} setFormData={setFormData} />;
      case 3: return <FinancialStep formData={formData} setFormData={setFormData} />;
      case 4: return <SkillsStep formData={formData} setFormData={setFormData} />;
      case 5: return <InterestsStep formData={formData} setFormData={setFormData} />;
      case 6: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex bg-[#080d1a] font-sans antialiased overflow-hidden">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[42%] relative flex-col justify-between p-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-900/40 to-[#080d1a]" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] -top-40 -left-40" />
        <div className="absolute w-[300px] h-[300px] bg-purple-500/8 rounded-full blur-[100px] bottom-20 right-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Work2Business</span>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Your Journey Starts Here</p>
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight mb-5">
            Turn your expertise<br />
            <span className="gradient-text">into a business.</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            We analyze your professional background, skills, and financial capacity to match you with the perfect business opportunities.
          </p>

          {/* Step indicators */}
          <div className="space-y-3">
            {STEPS.map((s) => (
              <div key={s.id} className={`flex items-center gap-3 transition-all duration-300 ${s.id <= step ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300
                  ${s.id < step ? "bg-indigo-500 text-white" : s.id === step ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400" : "bg-slate-800 text-slate-600"}`}>
                  {s.id < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-sm font-medium ${s.id === step ? "text-white" : s.id < step ? "text-slate-400" : "text-slate-600"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Work2Business Inc. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10 overflow-y-auto">
        <div className="absolute top-0 left-1/2 w-[600px] h-[300px] bg-indigo-600/8 blur-[100px] -translate-x-1/4 pointer-events-none" />
        <div className="w-full max-w-[520px] relative z-10">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Building2 className="text-white w-4 h-4" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">Work2Business</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <p className="section-label mb-1">Step {step} of {STEPS.length}</p>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {planInfo.name} plan · {planInfo.priceLabel}{planInfo.period ? ` ${planInfo.period}` : ""}
              </span>
              <Link to="/pricing" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Change plan
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {step === 1 && "Create your account"}
              {step === 2 && "Your employment background"}
              {step === 3 && "Financial capacity"}
              {step === 4 && "Your professional skills"}
              {step === 5 && "Your business interests"}
              {step === 6 && "Review your profile"}
            </h1>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>{STEPS[step - 1]?.label}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="glass rounded-2xl p-7 shadow-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              {step > 1 ? (
                <button onClick={back} className="btn-secondary">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button onClick={next} className="btn-primary ml-auto">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submit} disabled={isPending} className="btn-primary ml-auto">
                  {isPending ? (
                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Complete Setup</>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-center mt-5 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
