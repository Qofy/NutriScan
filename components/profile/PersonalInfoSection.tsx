'use client';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  country: string;
}

interface PersonalInfoSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PersonalInfoSection({
  formData,
  handleChange,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
            <input
              type="text"
              name="country"
              placeholder="e.g., Kenya, India, Nigeria"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">Used for localized food recommendations</p>
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
