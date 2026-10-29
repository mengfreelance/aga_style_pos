import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';
import api from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    api.get('/api/customers').then(({ data }) => {
      setCustomers(data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      api.put(`/api/customers/${editing.id}`, form).then(() => {
        setOpen(false); setEditing(null); setForm({ name: '', phone: '', email: '', address: '' });
        window.location.reload();
      });
    } else {
      api.post('/api/customers', form).then(() => {
        setOpen(false); setForm({ name: '', phone: '', email: '', address: '' });
        window.location.reload();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this customer?')) {
      api.delete(`/api/customers/${id}`).then(() => window.location.reload());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage customer information</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', phone: '', email: '', address: '' }); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-red-orange text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 w-72 transition"
          />
          <Users size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-gray-400">No customers yet</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-red-50 transition group">
                    <td className="py-4 text-gray-800 font-medium">{c.name}</td>
                    <td className="py-4 text-gray-600">{c.phone}</td>
                    <td className="py-4 text-gray-600">{c.email}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => { setEditing(c); setForm({ name: c.name ?? '', phone: c.phone ?? '', email: c.email ?? '', address: c.address ?? '' }); setOpen(true); }}
                        className="px-2 py-1 rounded-lg text-orange-600 text-sm font-medium hover:bg-orange-50 transition"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Customer' : 'Add Customer'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="e.g. John Doe"
              />
              <Users size={14} className="ml-2 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. 012345678"
                />
                <Phone size={14} className="ml-2 text-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. john@example.com"
                />
                <Mail size={14} className="ml-2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="e.g. 123 Street, Phnom Penh"
              />
              <MapPin size={14} className="ml-2 text-gray-400" />
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
