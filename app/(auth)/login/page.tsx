'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, selectAuth } from '@/features/auth';
import { AppDispatch } from '@/store';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector(selectAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 [LOGIN] Starting login process...');
    console.log('📝 [LOGIN] Username:', username);
    try {
      console.log('⏳ [LOGIN] Sending login request to backend...');
      const startTime = performance.now();
      await dispatch(login(username, password));
      const endTime = performance.now();
      console.log(`✅ [LOGIN] Login successful! (${(endTime - startTime).toFixed(2)}ms)`);
      console.log('🔄 [LOGIN] Redirecting to home page...');
      router.push('/');
    } catch (error) {
      console.error('❌ [LOGIN] Login failed:', error);
      // Error is handled by Redux state
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Login</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-slate-300 text-black rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-slate-300 text-black rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center text-slate-600 mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold">
          Register
        </Link>
      </p>

      {/* Demo credentials
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-900 font-semibold mb-2">Demo Account:</p>
        <p className="text-sm text-orange-800">Username: <code className="bg-slate-50 px-2 py-1 rounded">kofisafoagyekum</code></p>
        <p className="text-sm text-orange-800">Password: (from your setup)</p>
      </div> */}
    </div>
  );
}
