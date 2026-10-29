import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Tag } from 'lucide-react';
import api from '../services/api';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '' });

  useEffect(() => {
    api.get('/api/brands').then(({ data }) => {
      setBrands(data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      api.put(`/api/brands/${editing.id}`, form).then(() => {
        setOpen(false); setEditing(null); setForm({ name: '' });
        window.location.reload();
      });
    } else {
      api.post('/api/brands', form).then(() => {
        setOpen(false); setForm({ name: '' });
        window.location.reload();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this brand?')) {
      api.delete(`/api/brands/${id}`).then(() => window.location.reload());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-500 mt-1">Manage clothing brands</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '' }); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-red-orange text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={2} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={2} className="p-6 text-center text-gray-400">No brands yet</td></tr>
              ) : (
                brands.map((b) => (
                  <tr key={b.id} className="hover:bg-red-50 transition group">
                    <td className="py-4 text-gray-800 font-medium">{b.name}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => { setEditing(b); setForm({ name: b.name ?? '' }); setOpen(true); }}
                        className="px-2 py-1 rounded-lg text-orange-600 text-sm font-medium hover:bg-orange-50 transition"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="ml-2 px-2 py-1 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Brand' : 'Add Brand'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="e.g. Nike"
              />
              <Tag size={14} className="ml-2 text-gray-400" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl gradient-red-orange text-white font-medium shadow-sm hover:opacity-90 transition"
              >
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
