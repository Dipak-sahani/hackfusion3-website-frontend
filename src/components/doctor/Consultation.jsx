import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { FileText, Save, List, Video, CheckCircle, Info } from 'lucide-react';

const Consultation = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchConfirmed = async () => {
        try {
            const res = await doctorAPI.getAppointments();
            // Filter only confirmed or completed apps for consultation view
            const filtered = res.data.filter(a => a.status === 'confirmed' || a.status === 'completed');
            setAppointments(filtered);
            if (filtered.length > 0 && !selectedId) {
                setSelectedId(filtered[0]._id);
                setNotes(filtered[0].doctorNotes || '');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfirmed();
    }, []);

    const handleSelect = (app) => {
        setSelectedId(app._id);
        setNotes(app.doctorNotes || '');
    };

    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            await doctorAPI.addNotes(selectedId, notes);
            alert('Notes saved successfully');
            fetchConfirmed();
        } catch (error) {
            alert('Failed to save notes');
        } finally {
            setSaving(false);
        }
    };

    const selectedApp = appointments.find(a => a._id === selectedId);

    if (loading) return <div className="p-8">Loading consultations...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)] gap-6">
            {/* Appointment List Sidebar */}
            <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
                    <List className="w-5 h-5 mr-2 text-blue-600" />
                    <h2 className="font-bold text-gray-800">Confirmed Visits</h2>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {appointments.length > 0 ? (
                        appointments.map(app => (
                            <button
                                key={app._id}
                                onClick={() => handleSelect(app)}
                                className={`w-full p-4 text-left transition-colors hover:bg-gray-50 flex flex-col ${selectedId === app._id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                            >
                                <span className="font-bold text-gray-800">{app.userId?.name}</span>
                                <span className="text-xs text-gray-500 mt-1">{app.date} | {app.timeSlot}</span>
                                <span className={`text-[10px] uppercase font-bold mt-2 px-1.5 py-0.5 rounded w-fit ${app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {app.status}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">No confirmed appointments.</div>
                    )}
                </div>
            </div>

            {/* Consultation Detail Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {selectedApp ? (
                    <>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 font-primary">Patient: {selectedApp.userId?.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">Consultation ID: {selectedApp._id}</p>
                            </div>
                            {selectedApp.type === 'online' && (
                                <a
                                    href={selectedApp.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Start Call
                                </a>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col lg:flex-row gap-8 overflow-y-auto">
                            {/* Patient Info Card */}
                            <div className="w-full lg:w-1/3 space-y-6">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Info className="w-4 h-4 mr-2" />
                                        Contact Info
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-800">{selectedApp.userId?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-800">{selectedApp.userId?.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                                        Appointment Slot
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-900">{selectedApp.timeSlot}</p>
                                    <p className="text-sm text-blue-700">{selectedApp.date}</p>
                                </div>
                            </div>

                            {/* Medical Notes Area */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center mb-4 text-gray-700">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    <h3 className="font-bold">Clinical Notes & Observations</h3>
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Type patient history, diagnosis, or prescriptions here..."
                                    className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-800 leading-relaxed shadow-inner font-primary"
                                />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveNotes}
                                        disabled={saving}
                                        className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition font-bold shadow-lg"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        {saving ? 'Saving...' : 'Save Consultation Notes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 font-medium">
                        Select an appointment from the list to start the consultation.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consultation;
