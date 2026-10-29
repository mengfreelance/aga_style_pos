import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Categories from './components/Categories';
import Brands from './components/Brands';
import Variants from './components/Variants';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';

const pageComponents = {
  dashboard: <Dashboard />,
  products: <Products />,
  categories: <Categories />,
  brands: <Brands />,
  variants: <Variants />,
  customers: <Customers />,
  sales: <Sales />,
  reports: <Reports />,
  settings: <Settings />,
};

export default function App() {
  const savedPage = localStorage.getItem('stylepos_page');
  const [page, setPage] = useState(savedPage ?? (localStorage.getItem('stylepos_token') ? 'dashboard' : 'login'));
  const [authMode, setAuthMode] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('stylepos_token');

  const handlePageChange = (nextPage) => {
    localStorage.setItem('stylepos_page', nextPage);
    setPage(nextPage);
    setAuthMode(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center">
          {authMode === 'create-account' ? (
            <CreateAccount onLogin={() => setAuthMode('login')} />
          ) : (
            <Login
              onLogin={() => {
                localStorage.setItem('stylepos_page', 'dashboard');
                setPage('dashboard');
                setAuthMode(null);
              }}
              onCreateAccount={() => setAuthMode('create-account')}
            />
          )}
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden relative">
          {/* Sidebar */}
          <Sidebar
            active={page}
            onSelect={handlePageChange}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileMenuOpen={mobileMenuOpen}
          />

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar
              page={page}
              onSelect={handlePageChange}
              onLogout={() => {
                localStorage.removeItem('stylepos_page');
                localStorage.removeItem('stylepos_token');
                setPage('login');
                setAuthMode('login');
              }}
              onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
              mobileMenuOpen={mobileMenuOpen}
            />
            <main className="flex-1 overflow-y-auto bg-soft-orange p-6 lg:p-8">
              {pageComponents[page] ?? <Dashboard />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
