import React, { useEffect, useState } from 'react';
import { medicineAPI } from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Inventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
    const [formData, setFormData] = useState({ name: '', currentStock: 0, pricePerUnit: 0, unit: 'tablet', description: '', lowStockThreshold: 50, isPaused: false, nextRefillDate: '', requiresPrescription: true });
    const [editingId, setEditingId] = useState(null);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const res = await medicineAPI.getAll();
            setMedicines(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await medicineAPI.update(editingId, formData);
            } else {
                await medicineAPI.create(formData);
            }
            setShowModal(false);
            setFormData({ name: '', currentStock: 0, pricePerUnit: 0, unit: 'tablet', description: '', lowStockThreshold: 50, isPaused: false, nextRefillDate: '', requiresPrescription: true });
            setEditingId(null);
            fetchMedicines();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            await medicineAPI.delete(id);
            fetchMedicines();
        }
    };

    const openEdit = (med) => {
        setFormData({
            ...med,
            requiresPrescription: med.requiresPrescription !== false // Handle case where field might be missing
        });
        setEditingId(med._id || med.id);
        setShowModal(true);
    };

    const openAdd = () => {
        setFormData({ name: '', currentStock: 0, pricePerUnit: 0, unit: 'tablet', description: '', lowStockThreshold: 50, isPaused: false, nextRefillDate: '', requiresPrescription: true });
        setEditingId(null);
        setShowModal(true);
    };

    const handleViewExpiry = (date) => {
        setSelectedExpiryDate(date);
        setShowExpiryModal(true);
    };

    const filteredAndSorted = medicines
        .filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
            if (filter === 'All') return matchesSearch;
            return matchesSearch && m.status.replace('_', ' ') === filter.toUpperCase();
        })
        .sort((a, b) => {
            if (a.status === 'EXPIRED' && b.status !== 'EXPIRED') return -1;
            if (a.status !== 'EXPIRED' && b.status === 'EXPIRED') return 1;
            return 0;
        });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'EXPIRED':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">🔴 Expired</span>;
            case 'LOW_STOCK':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Low Stock</span>;
            case 'PAUSED':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Paused</span>;
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Global Inventory</h1>
                <button onClick={openAdd} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Medicine
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search medicines..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {['All', 'Active', 'Low Stock', 'Expired', 'Paused'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${filter === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refill</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rx</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSorted.map((med) => (
                            <tr key={med._id || med.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{med.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(med.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${med.currentStock <= (med.lowStockThreshold || 50) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {med.status === 'EXPIRED' ? 'No Medicine / Empty' : med.currentStock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    {med.status === 'EXPIRED' ? (
                                        <button onClick={() => handleViewExpiry(med.expiredOn)} className="text-xs text-blue-600 hover:underline">View Expired Date</button>
                                    ) : (
                                        med.nextRefillDate ? new Date(med.nextRefillDate).toLocaleDateString() : 'N/A'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${med.pricePerUnit}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${med.requiresPrescription ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {med.requiresPrescription ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openEdit(med)}
                                        className={`${med.status === 'PAUSED' ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'} mr-4`}
                                        disabled={med.status === 'PAUSED'}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(med._id || med.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Medicine' : 'Add Medicine'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full p-2 border rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" className="p-2 border rounded" placeholder="Stock" value={formData.currentStock} onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })} required />
                                <input type="number" className="p-2 border rounded" placeholder="Price" value={formData.pricePerUnit} onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Low Stock Threshold</label>
                                    <input type="number" className="w-full p-2 border rounded" placeholder="Low Stock Threshold" value={formData.lowStockThreshold} onChange={e => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider">Next Refill Date</label>
                                    <input type="date" className="w-full p-2 border rounded" value={formData.nextRefillDate ? new Date(formData.nextRefillDate).toISOString().split('T')[0] : ''} onChange={e => setFormData({ ...formData, nextRefillDate: e.target.value })} />
                                </div>
                            </div>
                            <input className="w-full p-2 border rounded" placeholder="Unit (tablet, strip...)" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} required />
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isPaused" checked={formData.isPaused} onChange={e => setFormData({ ...formData, isPaused: e.target.checked })} />
                                    <label htmlFor="isPaused" className="text-sm font-medium text-gray-700">Paused</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="requiresPrescription" checked={formData.requiresPrescription !== false} onChange={e => setFormData({ ...formData, requiresPrescription: e.target.checked })} />
                                    <label htmlFor="requiresPrescription" className="text-sm font-medium text-gray-700">Prescription Required</label>
                                </div>
                            </div>
                            <textarea className="w-full p-2 border rounded" placeholder="Description" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Expired Date Modal */}
            {showExpiryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-sm">
                        <h2 className="text-lg font-bold mb-4">Expiry Information</h2>
                        <p className="text-gray-600 mb-6"> This medicine expired on: <span className="font-bold text-red-600">{new Date(selectedExpiryDate).toLocaleDateString()}</span></p>
                        <div className="flex justify-end">
                            <button onClick={() => setShowExpiryModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
