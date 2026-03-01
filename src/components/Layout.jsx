import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/useAuthStore';
import { LayoutDashboard, Pill, ClipboardList, FileText, LogOut, Menu, Calendar, Video, User, AlertTriangle, RefreshCw } from 'lucide-react';

const Layout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = user?.role === 'doctor' ? [
        { path: '/doctor-dashboard', label: 'Home', icon: LayoutDashboard },
        { path: '/availability', label: 'Availability', icon: Calendar },
        { path: '/consultation', label: 'Consultation', icon: Video },
        { path: '/manual-review', label: 'Prescription Review', icon: FileText },
        { path: '/edit-profile', label: 'Edit Profile', icon: User },
    ] : [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/inventory', label: 'Inventory', icon: Pill },
        { path: '/missing-medicines', label: 'Missing Medicines', icon: AlertTriangle },
        { path: '/orders', label: 'Orders', icon: ClipboardList },
        { path: '/logs', label: 'Logs', icon: FileText },
        { path: '/edit-profile', label: 'Edit Profile', icon: User },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-blue-600 font-primary">{user?.role === 'doctor' ? 'DocPortal' : 'PharmaAdmin'}</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {/* Note: Lucide React icons are components, so we render them as <Icon /> */}
                                {/* However, 'clipboardList' from import might be 'ClipboardList' depending on version. 
                                    Standard lucide-react exports are PascalCase. Checking import... 
                                    Actually I used lowercase in import, let me fix that in the import line above to ClipboardList if needed.
                                    For safety, assuming standard exports. */}
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm md:hidden p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">PharmaAdmin</h1>
                    <button className="p-2 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
