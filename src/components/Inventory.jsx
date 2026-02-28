import React, { useEffect, useState, useRef } from 'react';
import { medicineAPI } from '../services/api';
import { Plus, Edit, Trash2, Search, X, Package, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Inventory = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showExpiryModal, setShowExpiryModal] = useState(false);
    const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null); // { type: 'success'|'error', message }
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '', productId: '', pzn: '', priceRec: 0, packageSize: '', description: '',
        currentStock: 0, pricePerUnit: 0, unit: 'tablet', lowStockThreshold: 50,
        isPaused: false, nextRefillDate: '', requiresPrescription: true
    });
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

    useEffect(() => { fetchMedicines(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await medicineAPI.update(editingId, formData);
            } else {
                await medicineAPI.create(formData);
            }
            setShowModal(false);
            setFormData({
                name: '', productId: '', pzn: '', priceRec: 0, packageSize: '', description: '',
                currentStock: 0, pricePerUnit: 0, unit: 'tablet', lowStockThreshold: 50,
                isPaused: false, nextRefillDate: '', requiresPrescription: true
            });
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
        setFormData({ ...med, requiresPrescription: med.requiresPrescription !== false });
        setEditingId(med._id || med.id);
        setShowModal(true);
    };

    const openAdd = () => {
        setFormData({
            name: '', productId: '', pzn: '', priceRec: 0, packageSize: '', description: '',
            currentStock: 0, pricePerUnit: 0, unit: 'tablet', lowStockThreshold: 50,
            isPaused: false, nextRefillDate: '', requiresPrescription: true
        });
        setEditingId(null);
        setShowModal(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadResult(null);
        const fd = new FormData();
        fd.append('file', file);

        try {
            const res = await medicineAPI.upload(fd);
            setUploadResult({ type: 'success', message: res.data.message });
            fetchMedicines();
        } catch (error) {
            const msg = error.response?.data?.message || 'Upload failed. Please check your file format.';
            setUploadResult({ type: 'error', message: msg });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredAndSorted = medicines
        .filter(m => {
            const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase());
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
            case 'EXPIRED': return <span className="badge badge-danger">Expired</span>;
            case 'LOW_STOCK': return <span className="badge badge-warning">Low Stock</span>;
            case 'PAUSED': return <span className="badge badge-neutral">Paused</span>;
            default: return <span className="badge badge-success">Active</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Global Inventory</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{medicines.length} medicines total</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".csv, .xls, .xlsx"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="btn bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-all duration-200 disabled:opacity-60"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                    <button onClick={openAdd} className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" /> Add Medicine
                    </button>
                </div>
            </div>

            {uploadResult && (
                <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium animate-fade-in-up ${uploadResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {uploadResult.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                    <span>{uploadResult.message}</span>
                    <button onClick={() => setUploadResult(null)} className="ml-auto p-1 hover:bg-black/5 rounded-lg"><X className="w-4 h-4" /></button>
                </div>
            )}

            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search medicines..."
                    className="input-modern"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
                {['All', 'Active', 'Low Stock', 'Expired', 'Paused'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${filter === tab ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="card-elevated overflow-hidden">
                <table className="table-modern">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Product ID</th>
                            <th>PZN</th>
                            <th>Price rec.</th>
                            <th>Package</th>
                            <th>Description</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSorted.map((med) => (
                            <tr key={med._id || med.id}>
                                <td className="font-semibold text-gray-800">{med.name}</td>
                                <td className="text-gray-600 text-sm">{med.productId || '—'}</td>
                                <td className="text-gray-600 text-sm">{med.pzn || '—'}</td>
                                <td className="font-medium">€{med.priceRec || med.pricePerUnit}</td>
                                <td className="text-gray-600 text-sm">{med.packageSize || med.unit}</td>
                                <td className="text-gray-500 text-xs max-w-[150px] truncate" title={med.description}>{med.description || '—'}</td>
                                <td className="text-right">
                                    <button onClick={() => openEdit(med)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(med._id || med.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">{editingId ? 'Edit Medicine' : 'Add Medicine'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Product Name *</label>
                                <input className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Paracetamol" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">Product ID</label>
                                    <input className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" placeholder="e.g. PRD-001" value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">PZN</label>
                                    <input className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" placeholder="e.g. 1234567" value={formData.pzn} onChange={e => setFormData({ ...formData, pzn: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">Rec. Price (€)</label>
                                    <input type="number" step="0.01" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" value={formData.priceRec} onChange={e => setFormData({ ...formData, priceRec: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">Package Size</label>
                                    <input className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" placeholder="e.g. 30 tabs" value={formData.packageSize} onChange={e => setFormData({ ...formData, packageSize: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">Current Stock</label>
                                    <input type="number" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" value={formData.currentStock} onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-medium mb-1 block">Price (€)</label>
                                    <input type="number" step="0.01" className="w-full p-2.5 border border-gray-200 rounded-xl text-sm" value={formData.pricePerUnit} onChange={e => setFormData({ ...formData, pricePerUnit: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-medium mb-1 block">Description</label>
                                <textarea className="w-full p-2.5 border border-gray-200 rounded-xl text-sm min-h-[80px]" placeholder="Medicine description, usage, etc." value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
