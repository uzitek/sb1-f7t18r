import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Package, LayoutDashboard, Box, Tag, Users, ShoppingCart, FileText, Settings } from 'lucide-react';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md">
        <div className="p-4">
          <Link to="/dashboard" className="flex items-center space-x-2 text-blue-600">
            <Package className="h-8 w-8" />
            <span className="text-xl font-bold">PackagingCountry</span>
          </Link>
        </div>
        <ul className="mt-4">
          {[
            { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/inventory', icon: Box, label: 'Inventory' },
            { path: '/products', icon: Tag, label: 'Products' },
            { path: '/categories', icon: Tag, label: 'Categories' },
            { path: '/suppliers', icon: Users, label: 'Suppliers' },
            { path: '/sales', icon: ShoppingCart, label: 'Sales' },
            { path: '/reports', icon: FileText, label: 'Reports' },
            { path: '/settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-2 p-4 hover:bg-gray-100"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;