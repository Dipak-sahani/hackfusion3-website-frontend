import React, { useEffect, useState } from 'react';
import { inventoryAPI } from '../services/api';
import { FileText, ArrowUp, ArrowDown } from 'lucide-react';

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await inventoryAPI.getLogs();
                setLogs(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">System Logs</h1>
            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                    {log.reason}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.medicine?.name || 'Unknown Medicine'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.changeAmount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {log.changeAmount > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                        {Math.abs(log.changeAmount)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.performedBy?.name || 'System'}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logs;
