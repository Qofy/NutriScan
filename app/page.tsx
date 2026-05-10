'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Apple, BicepsFlexed, Droplets, File, Salad, Sparkles } from "lucide-react";
import { fetchRecentAnalyses } from '@/features/food-analysis';
import { AppDispatch, RootState } from '@/store';

const apple = <Apple color="green"/>
const papper = <File color="green"/>
const spakles = <Sparkles color="green"/>
const bicepsFlexed = <BicepsFlexed color="green"/>

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: recentAnalyses } = useSelector((state: RootState) => state.foodAnalysis.recentAnalyses);

  useEffect(() => {
    // Defer setting mounted to the next tick to avoid synchronous setState in the effect
    const id = window.setTimeout(() => setMounted(true), 0);
    dispatch(fetchRecentAnalyses(100));
    return () => clearTimeout(id);
  }, [dispatch]);

  // Calculate stats from actual data
  const foodsAnalyzed = recentAnalyses.length;
  const thisMonthAnalyses = recentAnalyses.filter(analysis => {
    const analysisDate = new Date(analysis.uploaded_at);
    const now = new Date();
    return analysisDate.getMonth() === now.getMonth() &&
           analysisDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate average safety level (for health score)
  const safetyScores = recentAnalyses.reduce((acc, analysis) => {
    const scoreMap = { safe: 100, caution: 60, danger: 20 };
    return acc + (scoreMap[analysis.safety_level as keyof typeof scoreMap] || 0);
  }, 0);
  const healthScore = recentAnalyses.length > 0
    ? Math.round(safetyScores / recentAnalyses.length)
    : 0;

  const getHealthScoreSubtext = (score: number) => {
    if (score >= 80) return 'Excellent progress';
    if (score >= 60) return 'Good job';
    if (score >= 40) return 'Keep improving';
    return 'Needs attention';
  };

  const userName = user?.first_name ? user.first_name : user?.username || 'User';

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={apple}
            label="Foods Analyzed"
            value={mounted ? foodsAnalyzed.toString() : "0"}
            subtext={mounted ? `${thisMonthAnalyses} this month` : "0 this month"}
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={papper}
            label="Reports Uploaded"
            value="0"
            subtext="Active reports"
            bgColor="bg-teal-50"
          />
          <StatCard
            icon={spakles}
            label="Recommendations"
            value={mounted && recentAnalyses.length > 0 ? Math.ceil(recentAnalyses.length * 0.5).toString() : "0"}
            subtext="Pending review"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={bicepsFlexed}
            label="Health Score"
            value={mounted ? `${healthScore}%` : "0%"}
            subtext={mounted ? getHealthScoreSubtext(healthScore) : "Loading..."}
            bgColor="bg-purple-50"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-6 border border-emerald-100">
              <h3 className="font-semibold text-emerald-900 mb-2 flex gap-1.5">
                <Salad color="green"/> Eat the Rainbow
              </h3>
              <p className="text-sm text-emerald-800">
                Include a variety of colorful vegetables and fruits to get diverse nutrients and antioxidants.
              </p>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex gap-1.5">
                <Droplets color="green"/> Stay Hydrated
              </h3>
              <p className="text-sm text-blue-800">
                Drink at least 8 glasses of water daily to maintain optimal health and energy levels.
              </p>
            </div>
          </div>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}
