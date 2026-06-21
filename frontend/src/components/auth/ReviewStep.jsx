export default function ReviewStep({ formData }) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Review Information
        </h2>
        <p className="text-slate-400 text-sm">
          Please verify your details before deploying your entrepreneurship suite.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CARD 1: IDENTITY */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Personal Details
          </h3>
          <div className="space-y-2">
            <div>
              <span className="block text-xs text-slate-500 font-medium">Full Name</span>
              <span className="text-sm font-medium text-white">
                {formData.firstName || formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}`.trim() 
                  : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Email Address</span>
              <span className="text-sm font-medium text-white break-all">
                {formData.email || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: CAREER */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Professional Profile
          </h3>
          <div className="space-y-2">
            <div>
              <span className="block text-xs text-slate-500 font-medium">Profession</span>
              <span className="text-sm font-medium text-white">
                {formData.profession || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Current Employer</span>
              <span className="text-sm font-medium text-white">
                {formData.employer || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: FINANCES */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Financial Structure
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-slate-500 font-medium">Est. Monthly Salary</span>
              <span className="text-base font-semibold text-white mt-0.5 block">
                {formData.monthlySalary ? `$${Number(formData.monthlySalary).toLocaleString()}` : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Available Liquid Capital</span>
              <span className="text-base font-semibold text-emerald-400 mt-0.5 block">
                {formData.availableCapital ? `$${Number(formData.availableCapital).toLocaleString()}` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: SKILLS & ATTRIBUTES */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Core Core Capabilities & Interests
          </h3>
          
          <div className="space-y-4">
            {/* Skills Badges */}
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-2">Selected Expertise</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills && formData.skills.length > 0 ? (
                  formData.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-600 italic">No skills selected</span>
                )}
              </div>
            </div>

            {/* Interests Badges */}
            <div>
              <span className="block text-xs text-slate-500 font-medium mb-2">Target Sectors</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.interests && formData.interests.length > 0 ? (
                  formData.interests.map((interest) => (
                    <span key={interest} className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/5 text-indigo-400 border border-indigo-500/20">
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-600 italic">No business interests chosen</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}