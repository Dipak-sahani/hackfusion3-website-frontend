import React, { useEffect, useState } from 'react';
import { medicineAPI, orderAPI } from '../services/api'; // orderAPI.getAll needs implementation or we use a workaround
import { AlertTriangle, Package, ShoppingBag, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        lowStockItems: 0,
        totalRevenue: 0,
        totalMedicines: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetch
                const [medsRes, ordersRes] = await Promise.all([
                    medicineAPI.getAll(),
                    orderAPI.getAll() // Assuming this now exists or returns user orders (we might need admin endpoint)
                ]);

                const medicines = medsRes.data;
                const orders = ordersRes.data;

                // Calculate Stats
                const lowStock = medicines.filter(m => m.currentStock < 50).length; // Arbitrary threshold for global stock
                const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

                setStats({
                    totalMedicines: medicines.length,
                    lowStockItems: lowStock,
                    totalOrders: orders.length,
                    totalRevenue: revenue.toFixed(2) // keeping as string for display
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading stats...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Inventory Items"
                    value={stats.totalMedicines}
                    icon={Package}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={stats.lowStockItems}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtext="Items below 50 units"
                />
            </div>

            {/* Recent Activity or detailed charts could go here */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add New Medicine</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">View Recent Orders</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
