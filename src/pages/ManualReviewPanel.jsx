import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ManualReviewPanel = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [notes, setNotes] = useState('');

    const [editData, setEditData] = useState(null);

    const fetchPendingReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('prescriptions/manual-review/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingReviews(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingReviews();
    }, []);

    useEffect(() => {
        if (selectedReview) {
            setEditData({ ...selectedReview.prescriptionId?.extractedData });
            setNotes('');
        }
    }, [selectedReview]);

    const handleAction = async (action) => {
        if (!selectedReview) return;
        try {
            const token = localStorage.getItem('token');
            await api.post(`prescriptions/manual-review/${selectedReview._id}/action`, {
                action,
                notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelectedReview(null);
            setNotes('');
            fetchPendingReviews();
            alert(`Prescription ${action.toLowerCase()} successfully!`);
        } catch (error) {
            alert("Error processing action");
        }
    };

    const handleUpdateData = async () => {
        if (!selectedReview || !editData) return;
        try {
            const token = localStorage.getItem('token');
            await api.put(`prescriptions/manual-review/${selectedReview._id}/update-data`, {
                extractedData: editData,
                notes: notes || "Doctor updated the extracted data"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Data updated successfully!");
            fetchPendingReviews();
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Error updating data");
        }
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...editData.medicines];
        newMedicines[index] = { ...newMedicines[index], [field]: value };
        setEditData({ ...editData, medicines: newMedicines });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading pending reviews...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Prescription Manual Review Queue</h1>

            <div className="flex gap-6">
                {/* List View */}
                <div className="w-1/4 bg-white rounded-lg shadow-sm overflow-hidden border">
                    <div className="bg-gray-100 p-3 font-semibold border-b flex justify-between">
                        <span>Pending Tasks</span>
                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{pendingReviews.length}</span>
                    </div>
                    <div className="divide-y max-h-[800px] overflow-y-auto">
                        {pendingReviews.length === 0 && (
                            <div className="p-4 text-gray-400 text-center">No pending reviews</div>
                        )}
                        {pendingReviews.map((review) => (
                            <div
                                key={review._id}
                                className={`p-4 cursor-pointer hover:bg-indigo-50 transition ${selectedReview?._id === review._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                                onClick={() => setSelectedReview(review)}
                            >
                                <div className="font-medium text-gray-800 truncate">
                                    Doc: {review.prescriptionId?.extractedData?.doctorName || 'Unknown'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Patient: {review.prescriptionId?.extractedData?.patientName || 'N/A'}
                                </div>
                                <div className="text-[10px] text-red-500 mt-2 bg-red-50 inline-block px-2 py-0.5 rounded">
                                    {review.reason}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
                    {selectedReview && editData ? (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Review Details</h2>
                                    <p className="text-xs text-gray-400 mt-1">Prescription ID: {selectedReview.prescriptionId?._id}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-semibold transition flex items-center gap-2"
                                        onClick={handleUpdateData}
                                    >
                                        💾 Save Changes
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                                        onClick={() => handleAction('REJECTED')}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition"
                                        onClick={() => handleAction('APPROVED')}
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-6 flex-1">
                                {/* OCR & Image Section */}
                                <div className="col-span-4 flex flex-col gap-4">
                                    <div className="border rounded bg-gray-50 flex flex-col items-center justify-center p-4 min-h-[300px]">
                                        <div className="text-4xl mb-2 text-gray-300">📄</div>
                                        <p className="text-xs text-gray-400 mb-4">Original File</p>
                                        <a
                                            href={selectedReview.prescriptionId?.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white border text-indigo-600 text-xs px-4 py-2 rounded hover:bg-gray-50 transition shadow-sm"
                                        >
                                            👁️ Open Original PDF/Image
                                        </a>
                                    </div>

                                    <div className="bg-gray-900 rounded p-4 flex-1">
                                        <p className="font-semibold text-[10px] text-gray-400 uppercase mb-2 tracking-wider">Raw OCR Extraction</p>
                                        <div className="text-[10px] text-green-400 font-mono h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed opacity-80">
                                            {selectedReview.prescriptionId?.rawOcrText}
                                        </div>
                                    </div>
                                </div>

                                {/* Editable Data Section */}
                                <div className="col-span-8 space-y-6 overflow-y-auto pr-2 max-h-[800px]">
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200 shadow-inner">
                                        <div className="col-span-2 text-xs font-bold text-gray-500 uppercase mb-2">Doctor & Patient Info</div>
                                        <div>
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Doctor Name</label>
                                            <input
                                                className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={editData.doctorName || ''}
                                                onChange={(e) => setEditData({ ...editData, doctorName: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Registration No</label>
                                            <input
                                                className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={editData.doctorRegistrationNumber || ''}
                                                onChange={(e) => setEditData({ ...editData, doctorRegistrationNumber: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Patient Name</label>
                                            <input
                                                className="w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={editData.patientName || ''}
                                                onChange={(e) => setEditData({ ...editData, patientName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-gray-800 text-sm">Medicines Table</h4>
                                            <button
                                                className="text-xs text-indigo-600 font-bold hover:underline"
                                                onClick={() => setEditData({ ...editData, medicines: [...editData.medicines, { name: '', dosage: '', frequency: '', quantity: 1 }] })}
                                            >
                                                + Add Medicine
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {editData.medicines?.map((m, i) => (
                                                <div key={i} className="flex gap-2 items-end border-b pb-3">
                                                    <div className="flex-1">
                                                        <label className="block text-[9px] text-gray-400 font-bold mb-1">Name</label>
                                                        <input
                                                            className="w-full border rounded px-2 py-1 text-xs"
                                                            value={m.name || ''}
                                                            onChange={(e) => handleMedicineChange(i, 'name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <label className="block text-[9px] text-gray-400 font-bold mb-1">Dosage</label>
                                                        <input
                                                            className="w-full border rounded px-2 py-1 text-xs"
                                                            value={m.dosage || ''}
                                                            onChange={(e) => handleMedicineChange(i, 'dosage', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-20">
                                                        <label className="block text-[9px] text-gray-400 font-bold mb-1">Freq</label>
                                                        <input
                                                            className="w-full border rounded px-2 py-1 text-xs"
                                                            value={m.frequency || ''}
                                                            onChange={(e) => handleMedicineChange(i, 'frequency', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        className="text-red-400 mb-1 px-2"
                                                        onClick={() => {
                                                            const meds = [...editData.medicines];
                                                            meds.splice(i, 1);
                                                            setEditData({ ...editData, medicines: meds });
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Review Notes (Audit Log Entry)</label>
                                        <textarea
                                            className="w-full border rounded p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none bg-yellow-50"
                                            rows="3"
                                            placeholder="Explain why changes were made or why it was approved/rejected..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* Action History / Logs */}
                                    {selectedReview.prescriptionId?.reviewLogs?.length > 0 && (
                                        <div className="mt-8 border-t pt-6">
                                            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                📜 Audit History
                                            </h4>
                                            <div className="space-y-4">
                                                {selectedReview.prescriptionId.reviewLogs.map((log, idx) => (
                                                    <div key={idx} className="bg-gray-50 border rounded p-3 text-xs relative overflow-hidden">
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.action === 'APPROVED' ? 'bg-green-500' : log.action === 'REJECTED' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-bold text-gray-700">{log.action}</span>
                                                            <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-gray-600 mb-1 italic">"{log.notes}"</p>
                                                        <p className="text-[10px] text-gray-400">Moderated by Doc ID: {log.doctorId}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="text-6xl mb-4">👩‍⚕️</div>
                            <h3 className="text-xl font-bold text-gray-600">Doctor's Review Station</h3>
                            <p className="mt-2 text-center max-w-sm">Select a prescription from the pending queue to verify, edit, and approve records for the electronic health system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualReviewPanel;
