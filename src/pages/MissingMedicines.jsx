import React, { useState, useEffect } from 'react';
import { medicineAPI } from '../services/api';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const MissingMedicines = () => {
    const [missingItems, setMissingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchMissingMedicines();
    }, []);

    const fetchMissingMedicines = async () => {
        setLoading(true);
        try {
            const response = await medicineAPI.getMissing();
            setMissingItems(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch missing medicines:', err);
            setError('Failed to load missing medicines.');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, name) => {
        try {
            await medicineAPI.resolveMissing(id);
            showToast(`${name} marked as resolved.`, 'success');
            fetchMissingMedicines();
        } catch (err) {
            console.error('Failed to resolve missing medicine:', err);
            showToast(`Failed to resolve ${name}.`, 'error');
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Missing Medicines Alerts
            </h2>
            <p className="text-gray-500 mb-4 text-sm">
                These medicines were requested by users but are not in the inventory. Please add them to your stock.
            </p>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-blue-600">
                        <tr>
                            <th className="text-left px-4 py-3 text-white text-sm font-semibold">Medicine Name</th>
                            <th className="text-center px-4 py-3 text-white text-sm font-semibold">Times Requested</th>
                            <th className="text-left px-4 py-3 text-white text-sm font-semibold">Last Requested</th>
                            <th className="text-left px-4 py-3 text-white text-sm font-semibold">Status</th>
                            <th className="text-right px-4 py-3 text-white text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {missingItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                    No missing medicines currently tracked.
                                </td>
                            </tr>
                        ) : (
                            missingItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${item.requestedCount > 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.requestedCount}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(item.lastRequestedAt).toLocaleDateString()} at {new Date(item.lastRequestedAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">{item.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleResolve(item._id, item.name)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Mark Resolved
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Toast */}
            {toast.show && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50 ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {toast.message}
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))}><X className="w-4 h-4" /></button>
                </div>
            )}
        </div>
    );
};

export default MissingMedicines;
