'use client';

import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminRegisterPage() {
  return (
    <div className="bg-slate-50 rounded-lg shadow-2xl p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Lock size={32} className="text-blue-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">Admin Registration</h2>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Admin accounts are created and assigned by existing administrators.
        <br />
        <span className="block mt-2 text-sm">If you believe you should have admin access, please contact your system administrator.</span>
      </p>

      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
        <p className="text-blue-900 text-sm font-semibold mb-2">Regular User Account?</p>
        <p className="text-blue-800 text-sm mb-4">
          Create a regular user account to access the main NutriScan application.
        </p>
        <Link
          href="/register"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Create User Account
        </Link>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Admin Login
        </Link>
      </div>
    </div>
  );
}
