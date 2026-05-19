'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Apple, BicepsFlexed, Droplets, File, Salad, Sparkles } from "lucide-react";
import { fetchRecentAnalyses } from '@/features/food-analysis';
import { fetchMedicalReports } from '@/features/medical-reports';
import { AppDispatch, RootState } from '@/store';

const apple = <Apple color="#FF6B4A"/>
const papper = <File color="#FF6B4A"/>
const spakles = <Sparkles color="#FF6B4A"/>
const bicepsFlexed = <BicepsFlexed color="#FF6B4A"/>

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: recentAnalyses } = useSelector((state: RootState) => state.foodAnalysis.recentAnalyses);
  const { reports: medicalReports } = useSelector((state: RootState) => state.medicalReports);

  useEffect(() => {
    const id = window.setTimeout(() => setIsHydrated(true), 0);
    dispatch(fetchRecentAnalyses(100));
    dispatch(fetchMedicalReports() as any);
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Welcome back, {isHydrated ? (user?.first_name ? user.first_name : user?.username || 'User') : 'User'}!
          </h1>
          <p className="text-slate-600 mt-2">
            {isHydrated ? new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) : 'Loading...'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <StatCard
            icon={apple}
            label="Foods Analyzed"
            value={isHydrated ? foodsAnalyzed.toString() : "0"}
            subtext={isHydrated ? `${thisMonthAnalyses} this month` : "0 this month"}
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={papper}
            label="Reports Uploaded"
            value={isHydrated ? medicalReports.length.toString() : "0"}
            subtext={isHydrated && medicalReports.length > 0 ? `${medicalReports.filter(r => r.status === 'completed').length} processed` : "No reports yet"}
            bgColor="bg-amber-50"
          />
          <StatCard
            icon={spakles}
            label="Recommendations"
            value={isHydrated && recentAnalyses.length > 0 ? Math.ceil(recentAnalyses.length * 0.5).toString() : "0"}
            subtext="Pending review"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={bicepsFlexed}
            label="Health Score"
            value={isHydrated ? `${healthScore}%` : "0%"}
            subtext={isHydrated ? getHealthScoreSubtext(healthScore) : "Loading..."}
            bgColor="bg-orange-100"
          />
        </div>

        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>

        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-linear-to-br from-orange-50 to-amber-50 p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-orange-900 mb-2 flex gap-1.5">
                <Salad color="#FF6B4A"/> Eat the Rainbow
              </h3>
              <p className="text-sm text-orange-800">
                Include a variety of colorful vegetables and fruits to get diverse nutrients and antioxidants.
              </p>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-red-50 to-orange-50 p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-red-900 mb-2 flex gap-1.5">
                <Droplets color="#FF6B4A"/> Stay Hydrated
              </h3>
              <p className="text-sm text-red-800">
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
