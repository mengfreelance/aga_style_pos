import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, DollarSign, Users, AlertCircle, Clock, Package } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const statCards = [
  { label: 'Today Sales', value: '$0.00', icon: <DollarSign size={20} />, color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50', iconBg: 'bg-red-100' },
  { label: 'Orders', value: '0', icon: <ShoppingCart size={20} />, color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
  { label: 'Products', value: '0', icon: <Package size={20} />, color: 'text-green-600', border: 'border-green-200', bg: 'bg-green-50', iconBg: 'bg-green-100' },
  { label: 'Customers', value: '0', icon: <Users size={20} />, color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
];

const alertCards = [
  { label: 'Low Stock Items', value: '0', icon: <AlertCircle size={20} />, color: 'text-red-600' },
  { label: 'Pending Orders', value: '0', icon: <Clock size={20} />, color: 'text-orange-600' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(statCards);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/products').catch(() => ({ data: [] })),
      api.get('/api/sales').catch(() => ({ data: [] })),
      api.get('/api/customers').catch(() => ({ data: [] })),
    ]).then(([products, sales, customers]) => {
      setStats((prev) => [
        { ...prev[0], value: sales.data?.length?.toLocaleString() ?? '0' },
        { ...prev[1], value: sales.data?.length?.toLocaleString() ?? '0' },
        { ...prev[2], value: products.data?.length?.toLocaleString() ?? '0' },
        { ...prev[3], value: customers.data?.length?.toLocaleString() ?? '0' },
      ]);

      const salesList = sales.data ?? [];
      const daily = {};
      salesList.forEach((s) => {
        const day = new Date(s.created_at).toISOString().split('T')[0];
        daily[day] = (daily[day] || 0) + Number(s.total_amount || 0);
      });
      const labels = Object.keys(daily).sort();
      setChartData({
        labels,
        datasets: [
          {
            label: 'Sales ($)',
            data: labels.map((d) => daily[d]),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(239, 68, 68)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="space-y-6 p-2 lg:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((card, i) => (
          <div
            key={card.label}
            className={`rounded-2xl p-6 ${card.bg} ${card.border} flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.iconBg} shadow-sm`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-3xl font-bold {card.color}">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sales Overview</h2>
              <p className="text-sm text-gray-500">Track your store performance</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition shadow-sm">
                Export CSV
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
                Print
              </button>
            </div>
          </div>
          <div className="h-80 w-full rounded-xl border border-gray-200 bg-white p-4 relative overflow-hidden">
            {chartData && chartData.labels.length > 0 ? (
              <div className="h-full w-full">
                <Line data={chartData} options={options} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center pt-20 text-gray-400">
                <ShoppingCart size={48} className="mb-3 opacity-50" />
                <p className="text-sm">No sales data yet</p>
                <p className="text-xs text-gray-400 mt-1">Start selling to see your chart</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            Alerts
          </h2>
          <div className="space-y-3">
            {alertCards.map((card) => (
              <div key={card.label} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color.replace('text-', 'bg-')}100 ${card.color}`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{card.label}</p>
                    <p className="text-xs text-gray-500">All clear</p>
                  </div>
                </div>
                <span className="text-2xl font-bold {card.color}">{card.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart size={18} className="text-gray-500" />
            Recent Activities
          </h2>
          <button className="text-xs font-medium text-red-600 hover:text-red-700 transition">View All</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-600 flex-shrink-0">
                <ShoppingCart size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">New order #{1000 + i}</p>
                <p className="text-xs text-gray-500">Customer purchased items &bull; {i}h ago</p>
              </div>
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded">Completed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
