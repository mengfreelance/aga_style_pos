import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const iconMap = {
  dashboard: <BarChart3 size={18} />,
  products: <Package size={18} />,
  categories: <TagIcon size={18} />,
  brands: <TagIcon size={18} />,
  variants: <ShoppingCart size={18} />,
  customers: <Users size={18} />,
  sales: <CreditCard size={18} />,
  reports: <FileText size={18} />,
  settings: <SettingsIcon size={18} />,
};

function SettingsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 14a1.65 1.65 0 0 0-1-1.51 2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0 1 1.51V21a2 2 0 0 1 2 2 2 2 0 0 1 2-2v-.09A1.65 1.65 0 0 0 19 15a1.65 1.65 0 0 0-.33-1.82z" />
      <line x1="12" y1="13" x2="12" y2="19" />
    </svg>
  );
}

function BarChart3({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function Package({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 10z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="17" x2="12" y2="13" />
    </svg>
  );
}

function TagIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 16V2l7.17 7.17a2 2 0 0 1 0 2.83z" />
      <path d="M22 12v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShoppingCart({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="1" cy="5" r="1" />
      <circle cx="17" cy="5" r="1" />
      <path d="M1 5h2.5L8.5 14h8l2.5-11H19l-1.5 4.5" />
    </svg>
  );
}

function Users({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.47" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CreditCard({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function FileText({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="18" />
      <line x1="9" y1="15" x2="9" y2="15" />
      <line x1="16" y1="15" x2="16" y2="15" />
    </svg>
  );
}

const items = [
  { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
  { key: 'products', label: 'Products', icon: <Package size={18} /> },
  { key: 'categories', label: 'Categories', icon: <TagIcon size={18} /> },
  { key: 'brands', label: 'Brands', icon: <TagIcon size={18} /> },
  { key: 'variants', label: 'Variants', icon: <ShoppingCart size={18} /> },
  { key: 'customers', label: 'Customers', icon: <Users size={18} /> },
  { key: 'sales', label: 'POS Checkout', icon: <CreditCard size={18} /> },
  { key: 'reports', label: 'Reports', icon: <FileText size={18} /> },
  { key: 'settings', label: 'Settings', icon: <FileText size={18} /> },
];

export default function Sidebar({ active, onSelect, collapsed, onToggle }) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/me').then(({ data }) => {
      const u = data.user ?? data;
      setUser(u);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const avatarSrc = user?.image ?? null;
  const userName = user?.name ?? 'StylePOS';

  return (
    <aside
      className={`fixed left-0 top-0 h-full border-r border-white/60 glass z-30 transition-all duration-300 transform ${
        isDesktop
          ? collapsed
            ? 'translate-x-0 lg:relative lg:w-24 lg:shadow-none'
            : 'translate-x-0 lg:relative lg:w-60 lg:shadow-none'
          : collapsed
            ? '-translate-x-full'
            : 'translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/60 lg:px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-red-orange flex items-center justify-center text-white font-bold text-sm shadow-sm relative overflow-hidden">
            {!loading && avatarSrc ? (
              <img
                src={typeof avatarSrc === 'string' && (avatarSrc.startsWith('http') || avatarSrc.startsWith('blob:')) ? avatarSrc : `${API_BASE}/${avatarSrc.replace(/^\/+/, '')}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-sm">S</span>
            )}
          </div>
          {!collapsed && <span className="hidden lg:inline font-bold text-xl tracking-tighter text-red-700">
            {userName}
          </span>}
        </div>
        {isDesktop ? (
          <button
            onClick={onToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-red-100 text-gray-600 transition"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-red-100 text-gray-600 transition"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-1 lg:p-4">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => { onSelect(item.key); if (!isDesktop) onToggle(true); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
              active === item.key
                ? 'bg-red-600 text-white soft-shadow'
                : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            {iconMap[item.key]}
            {!collapsed && <span className="hidden lg:inline">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-3 border-t border-white/60">
        <div className="text-xs text-gray-400 px-3">StylePOS v1.0</div>
      </div>
    </aside>
  );
}
