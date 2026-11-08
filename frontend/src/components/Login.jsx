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
      window.showToast('Success', 'Welcome back!', 'success');
      onLogin();
    } catch (err) {
      window.showToast('Error', 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft px-4 lg:px-0">
      <div className="w-full max-w-xl lg:max-w-2xl">
        <div className="text-center mb-10 lg:mb-12">
          
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">StylePOS</h1>
          <p className="text-gray-500 mt-3 text-lg">Clothing Shop Point of Sale</p>
        </div>

        <div className="rounded-2xl bg-white p-10 lg:p-12 soft-shadow-xl border border-gray-100 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Welcome back</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="youremail@gmail.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 text-white font-semibold text-lg shadow-sm hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-500">
            Default: admin@stylepos.com / password
          </p>
          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={onCreateAccount}
              className="text-red-600 font-semibold hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
