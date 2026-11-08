import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Reports() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$0.00', icon: <DollarSign size={22} />, color: 'text-red-600' },
    { label: 'Total Orders', value: '0', icon: <ShoppingCart size={22} />, color: 'text-orange-600' },
    { label: 'Avg Order Value', value: '$0.00', icon: <DollarSign size={22} />, color: 'text-red-600' },
    { label: 'Low Stock Items', value: '0', icon: <AlertCircle size={22} />, color: 'text-orange-500' },
  ]);

  useEffect(() => {
    Promise.all([
      api.get('/api/sales').catch(() => ({ data: [] })),
      api.get('/api/products').catch(() => ({ data: [] })),
    ]).then(([salesRes, productsRes]) => {
      const sales = salesRes.data ?? [];
      const products = productsRes.data ?? [];
      const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
      setStats([
        { label: 'Total Revenue', value: totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <DollarSign size={22} />, color: 'text-red-600' },
        { label: 'Total Orders', value: sales.length.toLocaleString(), icon: <ShoppingCart size={22} />, color: 'text-orange-600' },
        { label: 'Avg Order Value', value: (sales.length ? totalRevenue / sales.length : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <DollarSign size={22} />, color: 'text-red-600' },
        { label: 'Low Stock Items', value: products.filter((p) => Number(p.stock_quantity ?? 0) <= 10).length.toLocaleString(), icon: <AlertCircle size={22} />, color: 'text-orange-500' },
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
            {[
              { name: 'Nike T-Shirt', sales: 45, revenue: '$1,125' },
              { name: 'Adidas Pants', sales: 32, revenue: '$1,280' },
              { name: 'Zara Shirt', sales: 28, revenue: '$840' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100">
                <span className="w-6 text-center text-xs font-bold text-gray-500">#{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.sales} sold</div>
                </div>
                <span className="text-sm font-bold text-red-600">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {[
              { id: 1001, customer: 'John Doe', amount: '$45.00', time: '2h ago' },
              { id: 1002, customer: 'Jane Smith', amount: '$120.00', time: '5h ago' },
              { id: 1003, customer: 'Walk-in', amount: '$30.00', time: '1d ago' },
            ].map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-800">Order #{s.id}</div>
                  <div className="text-xs text-gray-500">{s.customer}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">{s.amount}</div>
                  <div className="text-xs text-gray-500">{s.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Currency Split</h3>
          <div className="space-y-4">
            {[
              { label: 'USD', value: 65, color: 'bg-red-500' },
              { label: 'KHR', value: 35, color: 'bg-orange-500' },
            ].map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" className={c.color} />
                    <span className="text-sm font-medium text-gray-700">{c.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800">{c.value}%</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className={`h-full rounded-full transition-all duration-500 ${c.color}`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
