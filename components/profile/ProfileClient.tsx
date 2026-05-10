'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateProfile, fetchHealthProfile } from '@/features/auth';
import PersonalInfoSection from './PersonalInfoSection';
import HealthConditionsSection from './HealthConditionsSection';
import AllergiesSection from './AllergiesSection';
import NotificationPreferences from './NotificationPreferences';
import ActionButtons from './ActionButtons';
import StatusMessage from './StatusMessage';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  conditions: {
    diabetes: boolean;
    hypertension: boolean;
    allergies: boolean;
    heartDisease: boolean;
  };
  allergies: string;
  dietaryPreferences: string;
}

export default function ProfileClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>(() => ({
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
            dietaryPreferences:
              Array.isArray(healthProfile.dietary_preferences) &&
              healthProfile.dietary_preferences.length > 0
                ? healthProfile.dietary_preferences[0]
                : prev.dietaryPreferences,
          }));
        }
      }
    };

    loadProfileData();
  }, [user, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      await dispatch(
        updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
          conditions: formData.conditions,
          allergies: formData.allergies,
          dietaryPreferences: formData.dietaryPreferences,
        }) as any
      );
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
    <div className="space-y-8">
      {saveStatus === 'success' && (
        <StatusMessage type="success" message="Profile updated successfully!" />
      )}

      {(saveStatus === 'error' || error) && (
        <StatusMessage type="error" message={error || 'Failed to update profile'} />
      )}

      <PersonalInfoSection formData={formData} handleChange={handleChange} />
      <HealthConditionsSection
        conditions={formData.conditions}
        handleCheckboxChange={handleCheckboxChange}
      />
      <AllergiesSection formData={formData} handleChange={handleChange} />
      <NotificationPreferences />

      <ActionButtons loading={loading} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}
