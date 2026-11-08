import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Trash } from 'lucide-react';
import api from '../services/api';
import ConfirmDialog from './ConfirmDialog';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const fetchBrands = () => {
    api.get('/api/brands').then(({ data }) => {
      setBrands(data ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      api.put(`/api/brands/${editing.id}`, form).then(() => {
        setOpen(false); setEditing(null); setForm({ name: '' });
        window.showToast('Success', 'Brand updated', 'success');
        fetchBrands();
      }).catch(() => {
        window.showToast('Error', 'Failed to update brand', 'error');
      });
    } else {
      api.post('/api/brands', form).then(() => {
        setOpen(false); setForm({ name: '' });
        window.showToast('Success', 'Brand created', 'success');
        fetchBrands();
      }).catch(() => {
        window.showToast('Error', 'Failed to create brand', 'error');
      });
    }
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: 'Delete Brand',
      message: 'Are you sure you want to delete this brand?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/brands/${id}`);
          setSelected(new Set()); setSelectMode(false); setSelectAll(false);
          window.showToast('Success', 'Brand deleted', 'success');
          fetchBrands();
        } catch (err) {
          window.showToast('Error', 'Failed to delete brand', 'error');
        }
      },
    });
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    setSelectAll(next.size > 0 && next.size === brands.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) { setSelected(new Set()); setSelectAll(false); }
    else { setSelected(new Set(brands.map((b) => b.id))); setSelectAll(true); }
  };

  const isSelected = (id) => selected.has(id);

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    setConfirm({
      open: true,
      title: 'Delete Selected Brands',
      message: `Are you sure you want to delete ${selected.size} selected brand(s)?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all([...selected].map((id) => api.delete(`/api/brands/${id}`)));
          setSelected(new Set()); setSelectMode(false); setSelectAll(false);
          window.showToast('Success', `${selected.size} brand(s) deleted`, 'success');
          fetchBrands();
        } catch (err) {
          window.showToast('Error', 'Failed to delete selected brands', 'error');
        }
      },
    });
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium text-sm hover:opacity-90 transition shadow-sm"
        >
          <Plus size={18} /> Add Brand
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
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={selectMode ? 3 : 2} className="p-6 text-center text-gray-400">Loading...</td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={selectMode ? 3 : 2} className="p-6 text-center text-gray-400">No brands yet</td></tr>
              ) : (
                brands.map((b) => (
                  <tr key={b.id} className={`hover:bg-red-50 transition group ${isSelected(b.id) ? 'bg-red-50' : ''}`}>
                    {selectMode && (
                      <td className="py-4 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected(b.id)}
                          onChange={() => toggleSelect(b.id)}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 focus:ring-offset-1"
                        />
                      </td>
                    )}
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
        <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Edit Brand' : 'Add Brand'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-3 text-gray-400" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition"
                  placeholder="e.g. Nike"
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
