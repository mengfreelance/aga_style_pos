import { LogOut, Menu, X, ShoppingCart, BarChart3, Users, CreditCard, Package, FileText } from 'lucide-react';

function TagIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 16V2l7.17 7.17a2 2 0 0 1 0 2.83z" />
      <path d="M22 12v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const navItems = [
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

export default function Navbar({ page, onSelect, onLogout, onToggleMobileMenu, mobileMenuOpen }) {
  return (
    <header className="glass sticky top-0 z-40 w-full border-b border-white/60">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          {/* Mobile hamburger menu */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-red-100 text-gray-700 transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop nav items */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 text-sm font-medium text-gray-600 overflow-x-auto px-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`px-3 py-2 rounded-xl transition whitespace-nowrap ${
                page === item.key
                  ? 'bg-red-600 text-white soft-shadow'
                  : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-100'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-white/70 text-xs font-medium text-red-700 backdrop-blur">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" /> Online
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 border border-gray-200 text-gray-700 font-medium text-sm transition"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => onToggleMobileMenu(false)} />
          <div className="fixed top-0 left-0 z-50 w-full lg:w-80 h-full bg-white overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">Menu</h2>
              <button
                onClick={() => onToggleMobileMenu(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { onSelect(item.key); onToggleMobileMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-red-50 transition"
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition font-medium"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
