'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateProfile, fetchHealthProfile } from '@/features/auth';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState(() => ({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    age: '32',
    height: '5\'6"',
    weight: '65',
    conditions: {
      diabetes: false,
      hypertension: false,
      allergies: false,
      heartDisease: false,
    },
    allergies: '',
    dietaryPreferences: 'None',
  }));

  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
        }));

        // Load health profile data
        const healthProfile = await dispatch(fetchHealthProfile() as any);
        if (healthProfile) {
          setFormData((prev) => ({
            ...prev,
            age: healthProfile.age?.toString() || prev.age,
            height: healthProfile.height?.toString() || prev.height,
            weight: healthProfile.weight?.toString() || prev.weight,
            conditions: {
              diabetes: healthProfile.health_conditions?.includes('diabetes') || false,
              hypertension: healthProfile.health_conditions?.includes('hypertension') || false,
              allergies: healthProfile.health_conditions?.includes('allergies') || false,
              heartDisease: healthProfile.health_conditions?.includes('heartDisease') || false,
            },
            allergies: Array.isArray(healthProfile.allergies)
              ? healthProfile.allergies.join(', ')
              : healthProfile.allergies || '',
            dietaryPreferences: Array.isArray(healthProfile.dietary_preferences) && healthProfile.dietary_preferences.length > 0
              ? healthProfile.dietary_preferences[0]
              : prev.dietaryPreferences,
          }));
        }
      }
    };

    loadProfileData();
  }, [user, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [condition]: !prev.conditions[condition as keyof typeof prev.conditions],
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      await dispatch(updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        conditions: formData.conditions,
        allergies: formData.allergies,
        dietaryPreferences: formData.dietaryPreferences,
      }) as any);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        ...formData,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your health profile and preferences
          </p>
        </div>

        {saveStatus === 'success' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
            ✓ Profile updated successfully!
          </div>
        )}

        {(saveStatus === 'error' || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            ✗ {error || 'Failed to update profile'}
          </div>
        )}

        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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

          {/* Health Conditions */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Health Conditions
            </h2>

            <div className="space-y-4">
              {[
                { key: 'diabetes', label: 'Type 2 Diabetes' },
                { key: 'hypertension', label: 'Hypertension (High Blood Pressure)' },
                { key: 'allergies', label: 'Food Allergies' },
                { key: 'heartDisease', label: 'Heart Disease' },
              ].map((condition) => (
                <label key={condition.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.conditions[condition.key as keyof typeof formData.conditions]}
                    onChange={() =>
                      handleCheckboxChange(condition.key)
                    }
                    className="w-5 h-5 rounded border-gray-300  text-emerald-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-700">
                    {condition.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies & Restrictions */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Allergies & Dietary Restrictions
            </h2>

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

          {/* Preferences */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                { label: 'Daily health tips' },
                { label: 'Meal recommendations' },
                { label: 'Lab result alerts' },
                { label: 'Weekly progress summary' },
              ].map((pref) => (
                <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-gray-300 text-emerald-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-700">
                    {pref.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pb-8">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 sm:flex-initial px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
