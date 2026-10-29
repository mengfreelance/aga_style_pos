import { useState, useEffect } from 'react';
import { User, Image, Mail, Save, Edit } from 'lucide-react';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    api.get('/api/auth/me').then(({ data }) => {
      const u = data.user ?? data;
      setUser(u);
      setName(u.name ?? '');
      setEmail(u.email ?? '');
      setError(null);
      setImagePreview(u.image ?? null);
      setLoading(false);
    }).catch((err) => {
      setError(err.response?.data?.error ?? 'Failed to load profile');
      setLoading(false);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/auth/update-profile', { name, email });

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await fetch(`${API_BASE}/api/auth/update-profile-image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stylepos_token')}`,
          },
          body: formData,
        });
        const imgData = await res.json();
        if (imgData.image) {
          setImagePreview(imgData.image);
        }
      }

      setUser((prev) => prev ? { ...prev, name, email, image: imageFile ? imagePreview : prev.image } : null);
      setImageFile(null);
      setEditing(false);
    } catch (err) {
      alert('Failed to update profile: ' + (err.response?.data?.error ?? 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse bg-red-500 rounded-full w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-center p-6">
        <div className="max-w-md">
          <h2 className="text-xl font-bold mb-2">Unable to load profile</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const avatarSrc = imagePreview || (user?.image ?? null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile information</p>
      </div>

      <div className="max-w-2xl rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
            <p className="text-gray-500 text-sm">Manage your profile information</p>
          </div>
          <button
            onClick={() => {
              const next = !editing;
              setEditing(next);
              if (!next) {
                setImageFile(null);
                setImagePreview(user?.image ?? null);
              }
            }}
            disabled={loading || error}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            {avatarSrc ? (
              <img
                src={typeof avatarSrc === 'string' && (avatarSrc.startsWith('http') || avatarSrc.startsWith('blob:')) ? avatarSrc : `${API_BASE}/${avatarSrc.replace(/^\/+/, '')}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-red-50 text-red-600 border-4 border-red-100">
                <User size={32} />
              </div>
            )}
            {editing && (
              <div className="absolute -bottom-2 -right-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition shadow-sm">
                    <Image size={16} />
                  </div>
                </label>
              </div>
            )}
          </div>
          {editing && imageFile && (
            <button
              onClick={() => {
                setImageFile(null);
                setImagePreview(user?.image ?? null);
              }}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 font-medium bg-red-50 hover:bg-red-100 disabled:opacity-70 transition"
            >
              Remove
            </button>
          )}
        </div>

        {/* Name & Email */}
        {editing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="Enter your name"
              />
              <User size={16} className="ml-2 text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="Enter your email"
              />
              <Mail size={16} className="ml-2 text-gray-400" />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-xl gradient-red-orange text-white font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <span className="text-gray-900 font-medium">{user?.name ?? '—'}</span>
              <User size={16} className="ml-2 text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Email Address</span>
              <span className="text-gray-900 font-medium">{user?.email ?? '—'}</span>
              <Mail size={16} className="ml-2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Account Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Username</span>
              <span className="font-medium text-gray-800">{user?.username ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="font-medium text-gray-800 capitalize">{user?.role ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">User ID</span>
              <span className="font-medium text-gray-800">#{user?.id ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
