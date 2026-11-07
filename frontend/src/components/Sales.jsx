import { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Plus, Search, Trash2, ChevronLeft, Users, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const CURRENCY_RATES = { USD: 1, KHR: 4100 };

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [amountTendered, setAmountTendered] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [filterSize, setFilterSize] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

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

  const variantOptions = variants.map((v) => {
    const p = products.find((p) => p.id === v.product_id);
    const imageUrl = p?.image_url || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`;
    return {
      ...v,
      label: `${p?.name ?? 'Unknown'} — ${v.size} / ${v.color}`,
      imageUrl,
    };
  });

  const uniqueSizes = [...new Set(variants.map((v) => v.size))].sort();
  const uniqueColors = [...new Set(variants.map((v) => v.color))].sort();

  const filteredVariants = variantOptions.filter((v) => {
    if (filterSize && v.size !== filterSize) return false;
    if (filterColor && v.color !== filterColor) return false;
    if (filterGender) {
      const genderLower = filterGender.toLowerCase();
      const labelLower = v.label.toLowerCase();
      if (!labelLower.includes(genderLower)) return false;
    }
    if (filterPrice) {
      const price = Number(v.selling_price);
      if (filterPrice === 'under-20' && price >= 20) return false;
      if (filterPrice === '20-50' && (price < 20 || price > 50)) return false;
      if (filterPrice === '50-100' && (price < 50 || price > 100)) return false;
      if (filterPrice === 'over-100' && price <= 100) return false;
    }
    return true;
  });

  const hasActiveFilter = filterSize || filterColor || filterPrice || filterGender;

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const total = subtotal;
  const totalInSelected = currency === 'USD' ? total : total * CURRENCY_RATES.KHR;
  const change = amountTendered ? Number(amountTendered) - totalInSelected : 0;

  const addToCart = (variantId) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;
    const existing = cart.find((item) => item.variant_id === variantId);
    const p = products.find((p) => p.id === variant.product_id);
    const imageUrl = p?.image_url || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`;
    if (existing) {
      setCart(cart.map((item) =>
        item.variant_id === variantId
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * Number(item.unit_price) }
          : item
      ));
    } else {
      setCart([...cart, {
        variant_id: variant.id,
        product_name: variant.label,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        quantity: 1,
        unit_price: Number(variant.selling_price),
        total: Number(variant.selling_price),
        imageUrl,
      }]);
    }
  };

  const updateQuantity = (variantId, delta) => {
    setCart(cart.map((item) => {
      if (item.variant_id !== variantId) return item;
      const newQty = Math.max(0, item.quantity + delta);
      if (newQty === 0) return null;
      return { ...item, quantity: newQty, total: newQty * Number(item.unit_price) };
    }).filter(Boolean));
  };

  const removeFromCart = (variantId) => {
    setCart(cart.filter((item) => item.variant_id !== variantId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomer(null);
    setAmountTendered('');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    setProcessing(true);
    try {
      const payload = {
        customer_id: customer?.id ?? null,
        total_amount: total,
        currency,
        exchange_rate: currency === 'USD' ? 1 : CURRENCY_RATES.KHR,
        items: cart.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
        })),
        payment: {
          method: 'cash',
          currency,
          amount: Number(amountTendered),
          change_due: change > 0 ? change : 0,
        },
      };
      const res = await api.post('/api/sales', payload);
      setReceipt(res);
      window.showToast('Success', 'Sale completed', 'success');
      clearCart();
    } catch (err) {
      window.showToast('Error', 'Checkout failed: ' + (err.response?.data?.error ?? 'Unknown error'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">POS Checkout</h1>
          <p className="text-gray-500 mt-1">Scan barcode, add items, collect payment</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${currency === 'USD' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            USD
          </button>
          <button
            onClick={() => setCurrency('KHR')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${currency === 'KHR' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            KHR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        {/* Left: Product Search & Catalog */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-3 px-1">
              <div className="flex-1 min-w-[140px]">
                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-white"
                >
                  <option value="">All Size</option>
                  {uniqueSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-white"
                >
                  <option value="">All Color</option>
                  {uniqueColors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-white"
                >
                  <option value="">All Price</option>
                  <option value="under-20">Under $20</option>
                  <option value="20-50">$20–$50</option>
                  <option value="50-100">$50–$100</option>
                  <option value="over-100">Over $100</option>
                </select>
              </div>
              <div className="flex-1 min-w-[140px]">
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 bg-white"
                >
                  <option value="">All Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
              {hasActiveFilter && (
                <button
                  onClick={() => {
                    setFilterSize(''); setFilterColor(''); setFilterPrice(''); setFilterGender('');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3 relative">
              <input
                type="text"
                placeholder="Search product or scan barcode..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 w-full transition"
              />
              <ShoppingCart size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading products...</div>
              ) : variantOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No variants available</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {filteredVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => addToCart(v.id)}
                      className="flex flex-col items-center gap-2 px-2 py-2 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:border-red-200 transition-all shadow-sm min-h-[140px]"
                    >
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <img
                          src={v.imageUrl}
                          alt={v.label}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center px-1 py-0.5 rounded-bl-lg rounded-tr-lg">
                          ${Number(v.selling_price).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-[11px] font-medium text-gray-800 text-center truncate leading-tight w-full">
                        {v.label}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Cart */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100 flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h2>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 flex-1">
              {cart.length === 0 ? (
                <div className="p-6 text-center text-gray-400 flex flex-col items-center">
                  <ShoppingCart size={32} className="text-gray-200 mb-2" />
                  <div>Empty cart</div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.variant_id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100 min-h-[48px]">
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <img
                        src={item.imageUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.product_name}</div>
                      <div className="text-xs text-gray-500 truncate">{item.size} / {item.color} • {item.sku}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.variant_id, -1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                      >
                        <Trash2 size={12} className="rotate-45" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">${item.total.toFixed(2)}</div>
                      <button
                        onClick={() => removeFromCart(item.variant_id)}
                        className="text-xs text-red-500 hover:underline mt-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total ({currency})</span>
                <span className="text-xl font-bold text-red-600">{totalInSelected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Customer */}
            <div className="rounded-xl bg-gray-50 p-4 flex-shrink-0 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Customer (optional)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search customer by name or phone..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                />
                <button onClick={() => setCustomer(null)} className="px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 transition">
                  <Users size={16} />
                </button>
              </div>
              {customer && (
                <div className="mt-2 p-2 rounded-lg bg-orange-50 border border-orange-100">
                  <div className="text-xs font-medium text-orange-800">{customer.name}</div>
                  <div className="text-xs text-orange-600">{customer.phone}</div>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="mt-4 rounded-xl bg-white p-4 flex-shrink-0 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Payment</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Amount Tendered ({currency})</label>
                  <input
                    type="number"
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                  />
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Change Due</span>
                    <span className={`font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {change > 0 ? `+ ${change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : change === 0 ? '0.00' : `Short ${Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={processing || cart.length === 0 || change < 0}
                    className="w-full py-3 rounded-xl bg-red-600 text-white font-medium text-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition"
                  >
                    {processing ? 'Processing...' : 'Complete Sale'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <div className={`fixed inset-0 z-50 ${showReceipt ? 'flex' : 'hidden'} items-center justify-center`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowReceipt(false)} />
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 soft-shadow-lg animate-slide-up border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Receipt</h2>
            <button onClick={() => setShowReceipt(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">StylePOS</div>
              <div className="text-xs text-gray-500">#{receipt?.id ?? '—'}</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">{new Date().toLocaleString()}</div>
          </div>
          <div className="space-y-2 mb-4">
            {receipt?.sale_items?.map?.((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product_variant_id}</span>
                <span className="font-medium text-gray-800">${Number(item.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 mb-3">
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>Total</span>
              <span>${Number(receipt?.total_amount ?? 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <CreditCard size={14} />
            <span>Thank you for shopping!</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { window.print(); setShowReceipt(false); }}
              className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
            >
              Print
            </button>
            <button
              onClick={() => setShowReceipt(false)}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
