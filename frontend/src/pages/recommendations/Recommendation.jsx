import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";
import RecommendationCard from "../../components/recommendations/RecommendationCard";
import RecommendationFilters from "../../components/recommendations/RecommendationFilters";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import toast from "react-hot-toast";

export default function Recommendations() {
  const { user } = useContext(AuthContext); // Access logged-in user profile metrics
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toggle to show only profile-matched ideas
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);

  // Progress & generation tracking states
  const [generatingId, setGeneratingId] = useState(null);
  const [progress, setProgress] = useState(0);

  const [filters, setFilters] = useState({
    risk: "",
    maxCapital: "",
    category: ""
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (isMounted) setLoading(true);
        const res = await api.get("/recommendations");
        if (isMounted) setData(res.data.data);
      } catch (error) {
        console.error(error);
        if (isMounted) toast.error("Failed to load recommendations");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to calculate user alignment profile compatibility score
  const calculateMatchScore = (item) => {
    if (!user) return 0;
    let score = 0;

    // 1. Capital Check (Crucial factor)
    if (user.availableCapital && item.minimumCapital <= user.availableCapital) {
      score += 40; // High weight for affordability
    }

    // 2. Skills Match Array Verification
    if (Array.isArray(user.skills) && item.requiredSkills) {
      const matchedSkills = item.requiredSkills.filter(skill => 
        user.skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      );
      if (matchedSkills.length > 0) score += 30;
    }

    // 3. Category/Interests Match Verification
    if (Array.isArray(user.interests) && item.category) {
      const matchInterest = user.interests.some(
        interest => interest.toLowerCase() === item.category.toLowerCase()
      );
      if (matchInterest) score += 30;
    }

    return score;
  };

  // Filter and sort the ideas based on standard filters + user personalized context
  const processedData = data
    .filter((item) => {
      // Standard layout filters
      if (filters.risk && item.riskLevel !== filters.risk) return false;
      if (filters.maxCapital && item.minimumCapital > Number(filters.maxCapital)) return false;
      if (filters.category && !item.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      
      // Personalized profile match toggle constraint
      if (showOnlyMatches && user) {
        // Only show if user can afford it OR has matching skills/interests
        const isAffordable = user.availableCapital ? item.minimumCapital <= user.availableCapital : true;
        const score = calculateMatchScore(item);
        return isAffordable && score > 0;
      }

      return true;
    })
    .map(item => ({
      ...item,
      matchScore: calculateMatchScore(item) // Append dynamic alignment score attributes
    }))
    // High compatibility matching ideas rise to the top automatically
    .sort((a, b) => b.matchScore - a.matchScore);

  const generatePlan = async (ideaId) => {
    if (generatingId) return;

    setGeneratingId(ideaId);
    setProgress(5);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 400);

    try {
      await api.post("/ai/business-plan", { ideaId });
      setProgress(100);
      toast.success("Business plan generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate plan");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setGeneratingId(null);
        setProgress(0);
      }, 600);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 p-1">
        
        {/* Header Section */}
        <div className="relative mb-8 pb-5 border-b border-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Recommendations
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                AI-powered business opportunities matched to your execution profile.
              </p>
            </div>

            {/* Toggle Button for Personalised Match Syncing */}
            {user && (
              <button
                onClick={() => setShowOnlyMatches(!showOnlyMatches)}
                className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold tracking-wide uppercase rounded-xl transition-all border ${
                  showOnlyMatches 
                    ? "bg-blue-600 border-transparent text-white shadow-lg shadow-blue-600/10 hover:bg-blue-500" 
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full mr-2.5 ${showOnlyMatches ? "bg-white animate-pulse" : "bg-emerald-500"}`} />
                {showOnlyMatches ? "Showing Best Profile Matches" : "Filter By My Profile"}
              </button>
            )}
          </div>

          {/* Floating Accent Progress Bar Line */}
          {generatingId && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 overflow-hidden rounded-full">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Filter Toolbar Wrapper */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-900 mb-8 shadow-xl">
          <RecommendationFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 animate-pulse text-sm font-medium">Analyzing opportunities...</p>
          </div>
        ) : processedData.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
            <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-sm font-semibold text-slate-300">No results found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or matching preferences.</p>
          </div>
        ) : (
          <div>
            {/* Active Generation Banner Inline Layout */}
            {generatingId && (
              <div className="mb-6 bg-blue-950/40 border border-blue-900/60 rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <p className="text-sm font-medium text-slate-300">
                    Architecting your AI Business Plan... <span className="font-bold text-blue-400">{progress}%</span>
                  </p>
                </div>
              </div>
            )}

            {/* Cards Grid Component Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedData.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative transition-all duration-300 rounded-2xl bg-slate-900/40 border flex flex-col justify-between shadow-xl ${
                    generatingId === item.id 
                      ? "border-blue-500/80 ring-4 ring-blue-500/5 bg-slate-900/60" 
                      : "border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div>
                    {/* Smart Match Score Badge Header Injection */}
                    {user && item.matchScore > 0 && (
                      <div className="px-5 pt-4 flex justify-end">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${
                          item.matchScore >= 70 
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" 
                            : "bg-blue-950/60 text-blue-400 border border-blue-900/50"
                        }`}>
                          {item.matchScore}% Match
                        </span>
                      </div>
                    )}

                    <div className="p-1">
                      <RecommendationCard
                        item={item}
                        onGeneratePlan={generatePlan}
                        isGenerating={generatingId === item.id}
                        generationProgress={generatingId === item.id ? progress : 0}
                      />
                    </div>
                  </div>

                  {/* Local inline progress tracking bar inside the card container */}
                  {generatingId === item.id && (
                    <div className="px-5 pb-5 mt-2">
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}