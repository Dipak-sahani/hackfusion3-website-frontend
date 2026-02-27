import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // TODO: Update backend to verify if this returns ALL orders for admin or just user's own.
                // For now assuming we will fix backend or use what we have.
                const res = await orderAPI.getAll();
                setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const StatusBadge = ({ status }) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-yellow-100 text-yellow-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const icons = {
            draft: <Clock className="w-3 h-3 mr-1" />,
            confirmed: <CheckCircle className="w-3 h-3 mr-1" />,
            processing: <Clock className="w-3 h-3 mr-1" />,
            delivered: <Truck className="w-3 h-3 mr-1" />,
            cancelled: <XCircle className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status.toLowerCase()] || 'bg-gray-100'}`}>
                {icons[status.toLowerCase()]}
                {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
            <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <li key={order._id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            Order #{order._id.slice(-6).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            User: {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                                        </p>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {order.items.length} Items
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                            Total: <span className="font-semibold text-gray-900 ml-1">${order.totalAmount}</span>
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {orders.length === 0 && !loading && (
                        <li className="px-4 py-8 text-center text-gray-500">No orders found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Orders;
