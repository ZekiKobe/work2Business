import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Heart, Search, Zap } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/Skeleton";
import { PlanCard } from "./plans";
import api from "../../api/axios";
import { PLACEHOLDERS } from "../../constants/placeholders";

export default function FavoritePlans() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["favorite-plans"],
    queryFn: () => api.get("/business-plans/favorites").then((r) => r.data.data)
  });

  const { mutate: deletePlan } = useMutation({
    mutationFn: (id) => api.delete(`/business-plans/${id}`),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success("Plan deleted");
      queryClient.invalidateQueries(["favorite-plans"]);
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["dashboard-stats"]);
    },
    onError: () => toast.error("Failed to delete plan"),
    onSettled: () => setDeletingId(null)
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (id) => api.post(`/business-plans/${id}/favorite`),
    onSuccess: (res) => {
      if (!res.data.isFavorited) {
        toast.success("Removed from favorites");
      }
      queryClient.invalidateQueries(["favorite-plans"]);
      queryClient.invalidateQueries(["plans"]);
    },
    onError: () => toast.error("Failed to update favorite")
  });

  const plans = data || [];
  const filtered = plans.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.businessIdea?.name?.toLowerCase().includes(q) ||
      p.businessIdea?.category?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Favorite Plans"
        subtitle={`${plans.length} saved plan${plans.length !== 1 ? "s" : ""} for quick access`}
        badge={<span className="flex items-center gap-1"><Heart className="w-3 h-3 text-pink-400" /> Favorites</span>}
      />

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={PLACEHOLDERS.searchPlans}
          className="input-base pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={search ? "No favorites match your search" : "No favorite plans yet"}
          description={search ? "Try a different search term." : "Tap the heart icon on any business plan to save it here for later."}
          action={
            !search && (
              <Link to="/plans" className="btn-primary text-sm">
                <Zap className="w-4 h-4" /> Browse Plans
              </Link>
            )
          }
        />
      ) : (
        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                view="grid"
                onDelete={deletePlan}
                isDeleting={deletingId === plan._id}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
