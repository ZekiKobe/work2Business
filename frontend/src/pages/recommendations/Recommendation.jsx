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
      {/* Header Section */}
      <div className="relative mb-8 pb-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Recommendations
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              AI-powered business opportunities matched to your execution profile.
            </p>
          </div>

          {/* Toggle Button for Personalised Match Syncing */}
          {user && (
            <button
              onClick={() => setShowOnlyMatches(!showOnlyMatches)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all border ${
                showOnlyMatches 
                  ? "bg-blue-600 border-transparent text-white shadow-sm shadow-blue-600/10" 
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${showOnlyMatches ? "bg-white animate-pulse" : "bg-green-500"}`} />
              {showOnlyMatches ? "Showing Best Profile Matches" : "Filter By My Profile"}
            </button>
          )}
        </div>

        {/* Floating Accent Progress Bar Line */}
        {generatingId && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-full">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Filter Toolbar Wrapper */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-8">
        <RecommendationFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 animate-pulse text-sm font-medium">Analyzing opportunities...</p>
        </div>
      ) : processedData.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No results found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or matching preferences.</p>
        </div>
      ) : (
        <div>
          {/* Active Generation Banner Inline Layout */}
          {generatingId && (
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                <p className="text-sm font-medium text-blue-900">
                  Architecting your AI Business Plan... <span className="font-bold text-blue-600">{progress}%</span>
                </p>
              </div>
            </div>
          )}

          {/* Cards Grid Component Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedData.map((item) => (
              <div 
                key={item.id} 
                className={`relative transition-all duration-300 rounded-xl bg-white border flex flex-col justify-between ${
                  generatingId === item.id ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : "border-gray-200"
                }`}
              >
                <div>
                  {/* Smart Match Score Badge Header Injection */}
                  {user && item.matchScore > 0 && (
                    <div className="px-5 pt-4 flex justify-end">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.matchScore >= 70 ? "bg-green-50 text-green-700 border border-green-200" : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {item.matchScore}% Profile Match
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
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
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
    </DashboardLayout>
  );
}