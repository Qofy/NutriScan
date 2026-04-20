import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome back, Sarah! 👋
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
            icon="🍎"
            label="Foods Analyzed"
            value="24"
            subtext="This month"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon="📄"
            label="Reports Uploaded"
            value="3"
            subtext="Active reports"
            bgColor="bg-teal-50"
          />
          <StatCard
            icon="✨"
            label="Recommendations"
            value="12"
            subtext="Pending review"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon="💪"
            label="Health Score"
            value="87%"
            subtext="Excellent progress"
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
              <h3 className="font-semibold text-emerald-900 mb-2">
                🥗 Eat the Rainbow
              </h3>
              <p className="text-sm text-emerald-800">
                Include a variety of colorful vegetables and fruits to get diverse nutrients and antioxidants.
              </p>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">
                💧 Stay Hydrated
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
