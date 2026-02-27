import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { Calendar, Plus, Trash2, CheckCircle } from 'lucide-react';

const Availability = () => {
    const [availability, setAvailability] = useState([]);
    const [newDate, setNewDate] = useState('');
    const [newSlot, setNewSlot] = useState('');
    const [currentDateSlots, setCurrentDateSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const presetSlots = [
        "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM",
        "06:30 PM", "07:30 PM", "08:30 PM"
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await doctorAPI.getProfile();
            if (response.data.availability) {
                setAvailability(response.data.availability);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleQuickAdd = (slot) => {
        if (!currentDateSlots.includes(slot)) {
            setCurrentDateSlots([...currentDateSlots, slot]);
        }
    };

    const handleAddSlot = () => {
        if (!newSlot) return;
        setCurrentDateSlots([...currentDateSlots, newSlot]);
        setNewSlot('');
    };

    const handleRemoveSlot = (index) => {
        setCurrentDateSlots(currentDateSlots.filter((_, i) => i !== index));
    };

    const handleSaveDate = () => {
        if (!newDate || currentDateSlots.length === 0) {
            alert("Please select a date and add at least one slot.");
            return;
        }

        // Check if date already exists
        const existingIndex = availability.findIndex(a => a.date === newDate);
        let updated;
        if (existingIndex > -1) {
            updated = [...availability];
            updated[existingIndex] = { date: newDate, slots: currentDateSlots };
        } else {
            updated = [...availability, { date: newDate, slots: currentDateSlots }];
        }

        setAvailability(updated);
        setNewDate('');
        setCurrentDateSlots([]);
    };

    const handleRemoveDate = (date) => {
        setAvailability(availability.filter(a => a.date !== date));
    };

    const handleFinalSave = async () => {
        setLoading(true);
        try {
            await doctorAPI.updateAvailability(availability);
            setMessage('Availability saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Failed to save availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2 font-primary">Availability Management</h1>
                <p className="text-gray-500">Define your working hours and available slots for patients.</p>
            </div>

            {message && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg flex items-center shadow-sm">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add New Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-blue-600" />
                        Add Time Slots
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot (Select or Type)</label>

                            {/* Preset Slots */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {presetSlots.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleQuickAdd(s)}
                                        className="px-3 py-1 text-xs border border-gray-200 rounded-md bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSlot}
                                    onChange={(e) => setNewSlot(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add custom: HH:MM AM/PM"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSlot()}
                                />
                                <button
                                    onClick={handleAddSlot}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {currentDateSlots.map((slot, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center border border-blue-100">
                                    {slot}
                                    <button onClick={() => handleRemoveSlot(i)} className="ml-2 text-blue-400 hover:text-blue-600">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveDate}
                            className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition border border-blue-200 flex items-center justify-center"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Date Slots
                        </button>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        Current Availability State
                    </h2>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {availability.length > 0 ? (
                            availability.map((item, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                                    <button
                                        onClick={() => handleRemoveDate(item.date)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <p className="font-bold text-gray-700 mb-2">{item.date}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.slots.map((s, si) => (
                                            <span key={si} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 font-medium">
                                No slots added yet.
                            </div>
                        )}
                    </div>

                    {availability.length > 0 && (
                        <button
                            onClick={handleFinalSave}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-100"
                        >
                            {loading ? 'Saving...' : 'Save All Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Availability;
