import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Users, AlertCircle, Clock, Package } from 'lucide-react';
import api from '../services/api';

const statCards = [
  { label: 'Today Sales', value: '$0.00', icon: <DollarSign size={22} />, color: 'text-red-600', border: 'border-red-100', bg: 'bg-red-50', iconBg: 'bg-red-100' },
  { label: 'Orders', value: '0', icon: <ShoppingCart size={22} />, color: 'text-blue-600', border: 'border-blue-100', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
  { label: 'Products', value: '0', icon: <Package size={22} />, color: 'text-green-600', border: 'border-green-100', bg: 'bg-green-50', iconBg: 'bg-green-100' },
  { label: 'Customers', value: '0', icon: <Users size={22} />, color: 'text-purple-600', border: 'border-purple-100', bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
];

const alertCards = [
  { label: 'Low Stock Items', value: '0', icon: <AlertCircle size={22} />, color: 'text-red-600' },
  { label: 'Pending Orders', value: '0', icon: <Clock size={22} />, color: 'text-orange-600' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(statCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/products').catch(() => []),
      api.get('/api/sales').catch(() => []),
      api.get('/api/customers').catch(() => []),
    ]).then(([products, sales, customers]) => {
      setStats((prev) => [
        { ...prev[0], value: sales.data?.length?.toLocaleString() ?? '0' },
        { ...prev[1], value: sales.data?.length?.toLocaleString() ?? '0' },
        { ...prev[2], value: products.data?.length?.toLocaleString() ?? '0' },
        { ...prev[3], value: customers.data?.length?.toLocaleString() ?? '0' },
      ]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <div
            key={card.label}
            className={`rounded-2xl p-5 ${card.bg} ${card.border} flex items-center justify-between animate-fade-in`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
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
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 soft-shadow border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Overview</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">Export CSV</button>
              <button className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Print</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-gray-400">
            Sales chart placeholder
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-3">
            {alertCards.map((card, i) => (
              <div key={card.label} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color.replace('text-', 'bg-')}100 ${card.color}`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{card.label}</p>
                  <p className="text-xs text-gray-500">No issues found</p>
                </div>
                <span className="text-xl font-bold {card.color}">{card.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 soft-shadow border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                <ShoppingCart size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New order #{1000 + i}</p>
                <p className="text-xs text-gray-500">Customer purchased items • {i}h ago</p>
              </div>
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
