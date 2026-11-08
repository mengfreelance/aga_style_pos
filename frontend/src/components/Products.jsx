import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Image as ImageIcon, Trash } from 'lucide-react';
import api from '../services/api';
import ConfirmDialog from './ConfirmDialog';

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', cost_price: '', category_id: '', brand_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fetchData = () => {
    api.get('/api/products').then(({ data }) => {
      setProducts(data ?? []);
    });
    api.get('/api/categories').then(({ data }) => {
      setCategories(data ?? []);
    });
    api.get('/api/brands').then(({ data }) => {
      setBrands(data ?? []);
    }).finally(() => {
      setLoading(false);
      setVersion((v) => v + 1);
    });
  };

  useEffect(() => {
    fetchData();
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
      window.showToast('Success', editing ? 'Product updated' : 'Product created', 'success');
      fetchData();
    } catch (err) {
      window.showToast('Error', 'Failed to save product', 'error');
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
    setSelectAll(next.size > 0 && next.size === products.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      setSelected(new Set(products.map((p) => p.id)));
      setSelectAll(true);
    }
  };

  const isSelected = (id) => selected.has(id);

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/products/${id}`);
          setSelected(new Set());
          setSelectAll(false);
          window.showToast('Success', 'Product deleted', 'success');
          fetchData();
        } catch (err) {
          window.showToast('Error', 'Failed to delete product', 'error');
        }
      },
    });
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    setConfirm({
      open: true,
      title: 'Delete Selected Products',
      message: `Are you sure you want to delete ${selected.size} selected product(s)?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all([...selected].map((id) => api.delete(`/api/products/${id}`)));
          setSelected(new Set());
          setSelectAll(false);
          window.showToast('Success', `${selected.size} product(s) deleted`, 'success');
          fetchData();
        } catch (err) {
          window.showToast('Error', 'Failed to delete selected products', 'error');
        }
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in" key={version}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your clothing catalog and variants</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', description: '', cost_price: '', category_id: '', brand_id: '' }); setImageFile(null); setImagePreview(null); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {selected.size > 0 ? (
              <>
                <span className="text-sm font-medium text-gray-700">{selected.size} selected</span>
                <button
                  onClick={() => { setSelectMode(false); setSelected(new Set()); setSelectAll(false); }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setSelectMode(true)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Select
              </button>
            )}
          </div>
          {selected.size > 0 ? (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition shadow-sm"
            >
             Delete Selected
            </button>
          ) : (
            <input
              type="text"
              placeholder="Search products..."
              className="pl-4 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 w-64 transition"
            />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {selectMode && (
                  <th className="pb-3 pl-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-1"
                    />
                  </th>
                )}
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
                <tr><td colSpan={selectMode ? 7 : 6} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={selectMode ? 7 : 6} className="p-6 text-center text-gray-400">No products yet</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className={`hover:bg-red-50 transition group ${isSelected(p.id) ? 'bg-red-50' : ''}`}>
                    {selectMode && (
                      <td className="py-4 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-1"
                        />
                      </td>
                    )}
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
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. Cotton T-Shirt"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  value={form.brand_id}
                  onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
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
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium shadow-sm hover:opacity-90 transition"
              >
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={confirm?.open}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        variant={confirm?.variant ?? 'warning'}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
