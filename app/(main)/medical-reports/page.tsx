import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import MedicalReportsClient from '@/components/medical-reports/MedicalReportsClient';

export const metadata: Metadata = {
  title: 'Medical Reports | NutriScan',
  description: 'Upload and manage your medical reports for personalized health insights',
};

export default function MedicalReportsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-emerald-600" size={36} />
            Medical Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your medical reports for analysis and health insights
          </p>
        </div>

        <MedicalReportsClient />
      </div>
    </div>
  );
}
