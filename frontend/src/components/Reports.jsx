import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';
import api from '../services/api';

function timeAgo(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function Reports() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$0.00', icon: <DollarSign size={22} />, color: 'text-red-600' },
    { label: 'Total Orders', value: '0', icon: <ShoppingCart size={22} />, color: 'text-orange-600' },
    { label: 'Avg Order Value', value: '$0.00', icon: <DollarSign size={22} />, color: 'text-red-600' },
    { label: 'Low Stock Items', value: '0', icon: <AlertCircle size={22} />, color: 'text-orange-500' },
  ]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [currencySplit, setCurrencySplit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/sales').catch(() => ({ data: [] })),
      api.get('/api/products').catch(() => ({ data: [] })),
      api.get('/api/customers').catch(() => ({ data: [] })),
      api.get('/api/variants').catch(() => ({ data: [] })),
    ]).then(([salesRes, productsRes, customersRes, variantsRes]) => {
      const sales = salesRes.data ?? [];
      const products = productsRes.data ?? [];
      const customers = customersRes.data ?? [];
      const variants = variantsRes.data ?? [];

      const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);

      const productStock = {};
      variants.forEach((v) => {
        productStock[v.product_id] = (productStock[v.product_id] || 0) + Number(v.stock_quantity || 0);
      });

      const lowStockCount = products.filter((p) => Number(productStock[p.id] || 0) <= 10).length;

      setStats([
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <DollarSign size={22} />, color: 'text-red-600' },
        { label: 'Total Orders', value: sales.length.toLocaleString(), icon: <ShoppingCart size={22} />, color: 'text-orange-600' },
        { label: 'Avg Order Value', value: `$${(sales.length ? totalRevenue / sales.length : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <DollarSign size={22} />, color: 'text-red-600' },
        { label: 'Low Stock Items', value: lowStockCount.toLocaleString(), icon: <AlertCircle size={22} />, color: 'text-orange-500' },
      ]);

      const customerMap = {};
      customers.forEach((c) => { customerMap[c.id] = c.name || 'Customer'; });

      const recent = sales
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          customer: customerMap[s.customer_id] || 'Walk-in Customer',
          amount: s.total_amount,
          time: timeAgo(s.created_at),
        }));
      setRecentSales(recent);

      const top = products
        .map((p) => ({ ...p, totalStock: productStock[p.id] || 0 }))
        .sort((a, b) => b.totalStock - a.totalStock)
        .slice(0, 3);
      setTopProducts(top);

      const currencyTotals = {};
      sales.forEach((s) => {
        const cur = s.currency || 'USD';
        currencyTotals[cur] = (currencyTotals[cur] || 0) + Number(s.total_amount || 0);
      });
      const totalRev = Object.values(currencyTotals).reduce((a, b) => a + b, 0);
      const split = Object.entries(currencyTotals).map(([cur, amt]) => ({
        label: cur,
        value: totalRev ? Math.round((amt / totalRev) * 100) : 0,
        amount: amt,
      }));
      setCurrencySplit(split);

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse bg-red-500 rounded-full w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Sales performance and business insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <div key={card.label} className={`rounded-2xl p-5 bg-white border border-gray-100 soft-shadow flex items-center justify-between animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold {card.color}">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="w-6 text-center text-xs font-bold text-gray-500">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.totalStock} in stock</div>
                  </div>
                  <span className="text-sm font-bold text-red-600">{p.totalStock}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">No products available</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Order #{s.id}</div>
                    <div className="text-xs text-gray-500">{s.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">${Number(s.amount || 0).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{s.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">No sales recorded</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Currency Split</h3>
          <div className="space-y-4">
            {currencySplit.length > 0 ? (
              currencySplit.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${c.label === 'USD' ? 'bg-red-500' : 'bg-orange-500'}`} />
                      <span className="text-sm font-medium text-gray-700">{c.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">{c.value}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                    <div className={`h-full rounded-full transition-all duration-500 ${c.label === 'USD' ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${c.value}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">No sales data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
