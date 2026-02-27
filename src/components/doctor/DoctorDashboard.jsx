import React, { useEffect, useState } from 'react';
import { doctorAPI } from '../../services/api';
import { Calendar, Clock, User, Video, CheckCircle, XCircle } from 'lucide-react';

const AppointmentCard = ({ appointment, onStatusUpdate }) => {
    const isOnline = appointment.type === 'online';

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4 text-xl">
                    {appointment.userId?.name?.charAt(0) || 'P'}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{appointment.userId?.name || 'Patient'}</h3>
                    <div className="flex flex-col text-sm text-gray-500 space-y-1 mt-1">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {appointment.date}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.timeSlot}
                        </div>
                        <div className="flex items-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOnline ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                {appointment.type.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {appointment.status === 'pending' && (
                    <>
                        <button
                            onClick={() => onStatusUpdate(appointment._id, 'confirmed')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                        </button>
                        <button
                            onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
                            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                    </>
                )}

                {appointment.status === 'confirmed' && (
                    <>
                        {isOnline && (
                            <a
                                href={appointment.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Join Meeting
                            </a>
                        )}
                        <button
                            onClick={() => onStatusUpdate(appointment._id, 'completed')}
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                        >
                            Mark Completed
                        </button>
                    </>
                )}

                {appointment.status === 'completed' && (
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg flex items-center font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                    </span>
                )}
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const res = await doctorAPI.getAppointments();
            setAppointments(res.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await doctorAPI.updateStatus(id, status);
            fetchAppointments(); // Refresh
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading appointments...</div>;

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);
    const upcomingAppointments = appointments.filter(a => a.date > today);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2 font-primary">Doctor Dashboard</h1>
                <p className="text-gray-500">Manage your daily appointments and consultations.</p>
            </div>

            <section>
                <div className="flex items-center mb-4">
                    <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
                </div>
                <div className="grid gap-4">
                    {todayAppointments.length > 0 ? (
                        todayAppointments.map(app => (
                            <AppointmentCard key={app._id} appointment={app} onStatusUpdate={handleStatusUpdate} />
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 font-medium">
                            No appointments scheduled for today.
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-center mb-4">
                    <div className="w-2 h-6 bg-gray-400 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
                </div>
                <div className="grid gap-4">
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map(app => (
                            <AppointmentCard key={app._id} appointment={app} onStatusUpdate={handleStatusUpdate} />
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 font-medium">
                            No upcoming appointments.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DoctorDashboard;
