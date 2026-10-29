import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ShoppingCart, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', cost_price: '', category_id: '', brand_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    api.get('/api/products').then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category_id', form.category_id);
    formData.append('brand_id', form.brand_id);
    formData.append('description', form.description);
    formData.append('cost_price', form.cost_price);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editing) {
        await fetch(`${API_BASE}/api/products/${editing.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stylepos_token')}`,
          },
          body: formData,
        });
      } else {
        await fetch(`${API_BASE}/api/products`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('stylepos_token')}`,
          },
          body: formData,
        });
      }
      setOpen(false);
      setEditing(null);
      setForm({ name: '', description: '', cost_price: '', category_id: '', brand_id: '' });
      setImageFile(null);
      setImagePreview(null);
      window.location.reload();
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        window.location.reload();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your clothing catalog and variants</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', description: '', cost_price: '', category_id: '', brand_id: '' }); setImageFile(null); setImagePreview(null); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-red-orange text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 w-64 transition"
          />
          <ShoppingCart size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost Price</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">No products yet</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-red-50 transition group">
                    <td className="py-4">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-gray-800 font-medium">{p.name}</td>
                    <td className="py-4 text-gray-600">{p.category_id ?? '—'}</td>
                    <td className="py-4 text-gray-600">{p.brand_id ?? '—'}</td>
                    <td className="py-4 text-gray-800 font-medium">${Number(p.cost_price ?? 0).toFixed(2)}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => { setEditing(p); setForm({ name: p.name ?? '', description: p.description ?? '', cost_price: p.cost_price ?? '', category_id: p.category_id ?? '', brand_id: p.brand_id ?? '' }); setImagePreview(p.image_url ?? null); setOpen(true); }}
                        className="px-2 py-1 rounded-lg text-orange-600 text-sm font-medium hover:bg-orange-50 transition"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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

      {/* Add/Edit Modal */}
      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                placeholder="e.g. Cotton T-Shirt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                />
                {imagePreview && (
                  <div className="absolute right-2 top-2">
                    <img src={imagePreview} alt="preview" className="w-16 h-16 rounded-lg object-cover border-2 border-red-500" />
                  </div>
                )}
                <ImageIcon size={14} className="ml-2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price ($)</label>
                <input
                  type="number"
                  value={form.cost_price}
                  onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                <input
                  type="number"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand ID</label>
                <input
                  type="number"
                  value={form.brand_id}
                  onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                />
              </div>
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
