'use client';

import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function AdminRegisterPage() {
  return (
    <div className="bg-slate-50 rounded-lg shadow-2xl p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
          <Lock size={32} className="text-orange-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">Admin Registration</h2>

      <p className="text-slate-600 mb-6 leading-relaxed">
        Admin accounts are created and assigned by existing administrators.
        <br />
        <span className="block mt-2 text-sm">If you believe you should have admin access, please contact your system administrator.</span>
      </p>

      <div className="bg-orange-50 rounded-lg border border-orange-200 p-4 mb-6">
        <p className="text-orange-900 text-sm font-semibold mb-2">Regular User Account?</p>
        <p className="text-orange-800 text-sm mb-4">
          Create a regular user account to access the main NutriScan application.
        </p>
        <Link
          href="/register"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Create User Account
        </Link>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Admin Login
        </Link>
      </div>
    </div>
  );
}
