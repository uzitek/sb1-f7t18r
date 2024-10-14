import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingCart, AlertTriangle } from 'lucide-react';
import { dbService } from '../services/db';

interface DashboardData {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  lowStockItems: number;
  salesData: { name: string; sales: number }[];
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    lowStockItems: 0,
    salesData: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const products = await dbService.getAll<any>('products');
      const sales = await dbService.getAll<any>('sales');
      const inventory = await dbService.getAll<any>('inventory');

      const totalProducts = products.length;
      const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const totalOrders = sales.length;
      const lowStockItems = inventory.filter(item => item.quantity <= item.reorderLevel).length;

      // Generate mock sales data for the last 6 months
      const salesData = generateMockSalesData(sales);

      setDashboardData({
        totalProducts,
        totalSales,
        totalOrders,
        lowStockItems,
        salesData,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const generateMockSalesData = (sales: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      sales: Math.floor(Math.random() * 5000) + 1000, // Random sales data between 1000 and 6000
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Products"
          value={dashboardData.totalProducts.toString()}
          icon={<Package className="h-8 w-8 text-blue-500" />}
          color="bg-blue-100"
        />
        <DashboardCard
          title="Total Sales"
          value={`$${dashboardData.totalSales.toFixed(2)}`}
          icon={<DollarSign className="h-8 w-8 text-green-500" />}
          color="bg-green-100"
        />
        <DashboardCard
          title="Orders"
          value={dashboardData.totalOrders.toString()}
          icon={<ShoppingCart className="h-8 w-8 text-yellow-500" />}
          color="bg-yellow-100"
        />
        <DashboardCard
          title="Low Stock Items"
          value={dashboardData.lowStockItems.toString()}
          icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
          color="bg-red-100"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashboardData.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
};

export default Dashboard;