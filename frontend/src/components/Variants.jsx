import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, Tag, Trash } from 'lucide-react';
import api from '../services/api';

export default function Variants() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product_id: '', sku: '', size: '', color: '', selling_price: '', stock_quantity: '' });
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/api/products').catch(() => ({ data: [] })),
      api.get('/api/variants').catch(() => ({ data: [] })),
    ]).then(([prodRes, varRes]) => {
      setProducts(prodRes.data ?? []);
      setVariants(varRes.data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      product_id: Number(form.product_id),
      sku: form.sku,
      size: form.size,
      color: form.color,
      selling_price: Number(form.selling_price),
      stock_quantity: Number(form.stock_quantity),
    };
    if (editing) {
      api.put(`/api/variants/${editing.id}`, payload).then(() => {
        setOpen(false); setEditing(null); setForm({ product_id: '', sku: '', size: '', color: '', selling_price: '', stock_quantity: '' });
        window.showToast('Success', 'Variant updated', 'success');
        window.location.reload();
      }).catch(() => {
        window.showToast('Error', 'Failed to update variant', 'error');
      });
    } else {
      api.post('/api/variants', payload).then(() => {
        setOpen(false); setForm({ product_id: '', sku: '', size: '', color: '', selling_price: '', stock_quantity: '' });
        window.showToast('Success', 'Variant created', 'success');
        window.location.reload();
      }).catch(() => {
        window.showToast('Error', 'Failed to create variant', 'error');
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this variant?')) {
      api.delete(`/api/variants/${id}`).then(() => {
        setSelected(new Set()); setSelectMode(false); setSelectAll(false);
        window.showToast('Success', 'Variant deleted', 'success');
        window.location.reload();
      }).catch(() => {
        window.showToast('Error', 'Failed to delete variant', 'error');
      });
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    setSelectAll(next.size > 0 && next.size === variants.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) { setSelected(new Set()); setSelectAll(false); }
    else { setSelected(new Set(variants.map((v) => v.id))); setSelectAll(true); }
  };

  const isSelected = (id) => selected.has(id);

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} selected variant(s)?`)) return;
    try {
      await Promise.all([...selected].map((id) => api.delete(`/api/variants/${id}`)));
      setSelected(new Set()); setSelectMode(false); setSelectAll(false);
      window.showToast('Success', `${selected.size} variant(s) deleted`, 'success');
      window.location.reload();
    } catch (err) {
      window.showToast('Error', 'Failed to delete selected variants', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Variants</h1>
          <p className="text-gray-500 mt-1">Manage sizes, colors, SKUs, prices and stock</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ product_id: '', sku: '', size: '', color: '', selling_price: '', stock_quantity: '' }); setOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Variant
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
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
              <Trash size={14} /> Delete Selected
            </button>
          ) : null}
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
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Price</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Stock</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={selectMode ? 8 : 7} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : variants.length === 0 ? (
                <tr><td colSpan={selectMode ? 8 : 7} className="p-6 text-center text-gray-400">No variants yet</td></tr>
              ) : (
                variants.map((v) => {
                  const product = products.find((p) => p.id === v.product_id);
                  return (
                    <tr key={v.id} className={`hover:bg-red-50 transition group ${isSelected(v.id) ? 'bg-red-50' : ''}`}>
                      {selectMode && (
                        <td className="py-4 pl-4">
                          <input
                            type="checkbox"
                            checked={isSelected(v.id)}
                            onChange={() => toggleSelect(v.id)}
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-1"
                          />
                        </td>
                      )}
                      <td className="py-4 text-gray-800 font-medium">{product?.name ?? 'Unknown'}</td>
                      <td className="py-4 text-gray-600 font-mono text-sm">{v.sku}</td>
                      <td className="py-4 text-gray-600">{v.size}</td>
                      <td className="py-4 text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: v.color ?? '#ccc' }} />
                          {v.color}
                        </span>
                      </td>
                      <td className="py-4 text-gray-800 font-medium text-right">${Number(v.selling_price ?? 0).toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          Number(v.stock_quantity) <= 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {v.stock_quantity}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => { setEditing(v); setForm({ product_id: v.product_id ?? '', sku: v.sku ?? '', size: v.size ?? '', color: v.color ?? '', selling_price: v.selling_price ?? '', stock_quantity: v.stock_quantity ?? '' }); setOpen(true); }}
                          className="px-2 py-1 rounded-lg text-orange-600 text-sm font-medium hover:bg-orange-50 transition"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="ml-2 px-2 py-1 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 ${open ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Variant' : 'Add Variant'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <div className="relative">
                <select
                  required
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition bg-white"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ShoppingCart size={14} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. NK-TSHIRT-S-RED"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. S"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. Red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ($)</label>
                <input
                  type="number"
                  required
                  value={form.selling_price}
                  onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
              />
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
    </div>
  );
}
