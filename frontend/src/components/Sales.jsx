import { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, Plus, Search, Trash2, ChevronLeft, Users } from 'lucide-react';
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

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
    return {
      ...v,
      label: `${p?.name ?? 'Unknown'} — ${v.size} / ${v.color}`,
    };
  });

  const subtotal = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const total = subtotal;
  const totalInSelected = currency === 'USD' ? total : total * CURRENCY_RATES.KHR;
  const change = amountTendered ? Number(amountTendered) - totalInSelected : 0;

  const addToCart = (variantId) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;
    const existing = cart.find((item) => item.variant_id === variantId);
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
      setShowReceipt(true);
      clearCart();
      setCheckoutOpen(false);
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.error ?? 'Unknown error'));
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Product Search & Cart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Search product or scan barcode..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 w-full transition"
              />
              <ShoppingCart size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading products...</div>
              ) : variantOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No variants available</div>
              ) : (
                variantOptions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => addToCart(v.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-red-50 hover:border-red-200 text-left text-sm transition group"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{v.label}</div>
                      <div className="text-xs text-gray-500">{v.sku}</div>
                    </div>
                    <span className="text-red-600 font-bold">${Number(v.selling_price).toFixed(2)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Cart */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <div className="p-6 text-center text-gray-400">Empty cart</div>
              ) : (
                cart.map((item) => (
                  <div key={item.variant_id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{item.product_name}</div>
                      <div className="text-xs text-gray-500">{item.size} / {item.color} • {item.sku}</div>
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
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total ({currency})</span>
                <span className="text-xl font-bold text-red-600">{totalInSelected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Customer (optional)</h3>
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
          <div className="rounded-2xl bg-white p-5 soft-shadow border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Payment</h3>
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
                  className="w-full py-3 rounded-xl gradient-red-orange text-white font-medium text-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  {processing ? 'Processing...' : 'Complete Sale'}
                </button>
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
              className="flex-1 py-2.5 rounded-xl gradient-red-orange text-white font-medium hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
