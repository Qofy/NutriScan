'use client';

interface FormData {
  allergies: string;
  dietaryPreferences: string;
}

interface AllergiesSectionProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function AllergiesSection({ formData, handleChange }: AllergiesSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Allergies & Dietary Restrictions</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Food Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            placeholder="List any food allergies (comma-separated)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Dietary Preferences
          </label>
          <select
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="None">None</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Keto">Keto</option>
            <option value="Low-Carb">Low-Carb</option>
          </select>
        </div>
      </div>
    </div>
  );
}
