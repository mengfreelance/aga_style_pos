import { useState } from 'react';
import { ShoppingCart, Mail, Lock, User } from 'lucide-react';
import api from '../services/api';

export default function Login({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('stylepos_token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft px-4">
        <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-red-orange flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-sm">
            S
          </div>
          <h1 className="text-3xl font-bold text-gray-900">StylePOS</h1>
          <p className="text-gray-500 mt-1">Clothing Shop Point of Sale</p>
        </div>

        <div className="rounded-3xl bg-white p-8 soft-shadow-lg border border-gray-100 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl p-3 bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="admin@stylepos.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-red-orange text-white font-medium text-lg shadow-sm hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Default: admin@stylepos.com / password
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={onCreateAccount}
              className="text-red-600 font-medium hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
