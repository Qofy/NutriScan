import { Camera, File } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link
        href="/food-analysis"
        className="rounded-2xl bg-linear-to-br from-orange-500 to-red-500 p-6 text-white hover:shadow-xl transition-all duration-300 group cursor-pointer hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Quick Action</p>
            <h3 className="text-xl font-bold">Scan Food</h3>
            <p className="text-sm opacity-80 mt-1">
              Analyze food items with your camera
            </p>
          </div>
          <Camera size={40} className="group-hover:scale-110 transition-transform duration-300"/>
        </div>
      </Link>

      <Link
        href="/medical-reports"
        className="rounded-2xl bg-linear-to-br from-red-500 to-orange-500 p-6 text-white hover:shadow-xl transition-all duration-300 group cursor-pointer hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Quick Action</p>
            <h3 className="text-xl font-bold">Upload Report</h3>
            <p className="text-sm opacity-80 mt-1">
              Add medical reports for analysis
            </p>
          </div>
          <File size={40} className="group-hover:scale-110 transition-transform duration-300"/>
        </div>
      </Link>
    </div>
  );
}
