import { Camera, File } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link
        href="/food-analysis"
        className="rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 p-6 text-white hover:shadow-lg transition-all group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Quick Action</p>
            <h3 className="text-xl font-bold">Scan Food</h3>
            <p className="text-sm opacity-80 mt-1">
              Analyze food items with your camera
            </p>
          </div>
          <Camera size={40}/>
        </div>
      </Link>

      <Link
        href="/medical-reports"
        className="rounded-2xl bg-linear-to-br from-teal-500 to-teal-600 p-6 text-white hover:shadow-lg transition-all group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Quick Action</p>
            <h3 className="text-xl font-bold">Upload Report</h3>
            <p className="text-sm opacity-80 mt-1">
              Add medical reports for analysis
            </p>
          </div>
          <File size={40}/>
        </div>
      </Link>
    </div>
  );
}
