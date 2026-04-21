import { Apple, BicepsFlexed, File, Sparkles, TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

const apple = <Apple color="green"/>
const papper = <File color="green"/>
const spakles = <Sparkles color="green"/>
const alert = <TriangleAlert color="green"/>

interface Activity {
  id: string;
  type: 'food' | 'report' | 'recommendation';
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'food',
    title: 'Apple Analyzed',
    description: 'Safe for diabetic diet',
    timestamp: 'Today at 2:30 PM',
    icon: apple,
  },
  {
    id: '2',
    type: 'report',
    title: 'Medical Report Uploaded',
    description: 'Hypertension report processed',
    timestamp: 'Today at 10:45 AM',
    icon: papper,
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'New Recommendation',
    description: 'Green vegetables recommended',
    timestamp: 'Yesterday at 5:20 PM',
    icon: spakles,
  },
  {
    id: '4',
    type: 'food',
    title: 'Broccoli Analyzed',
    description: 'Excellent for your conditions',
    timestamp: 'Yesterday at 3:15 PM',
    icon: '🥦',
  },
  {
    id: '5',
    type: 'report',
    title: 'Allergy Alert',
    description: 'Peanut allergy noted',
    timestamp: '2 days ago',
    icon: alert,
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className="text-2xl flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
