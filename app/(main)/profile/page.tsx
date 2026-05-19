import ProfileClient from '@/components/profile/ProfileClient';

export const metadata = {
  title: 'Profile Settings - NutriScan',
  description: 'Manage your health profile and preferences',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-2">Manage your health profile and preferences</p>
        </div>

        <ProfileClient />
      </div>
    </div>
  );
}
