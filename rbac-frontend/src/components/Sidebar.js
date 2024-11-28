
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <button
                className={`fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 md:hidden ${
                    isOpen ? 'hidden' : 'block'
                }`}
                onClick={toggleSidebar}
            >
                ☰
            </button>

            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:w-64 z-40`}
            >
                <button
                    className="absolute top-4 right-4 px-3 py-2 bg-green-500 text-white rounded-full shadow-lg md:hidden focus:outline-none focus:ring-2 focus:ring-red-300"
                    onClick={toggleSidebar}
                >
                    ✕
                </button>
                <div className="p-6 text-center border-b border-blue-600">
                    <h1 className="text-xl font-bold tracking-wider">Menu</h1>
                    <p className="text-sm text-blue-300 mt-2">Role-Based Access Control</p>
                </div>
                <ul className="mt-4 space-y-4">
                    <li className="p-4 hover:bg-blue-800 transition-colors rounded-lg mx-2">
                        <Link to="/" className="flex items-center gap-4">
                            <DashboardIcon /> Dashboard
                        </Link>
                    </li>
                    <li className="p-4 hover:bg-blue-800 transition-colors rounded-lg mx-2">
                        <Link to="/users" className="flex items-center gap-4">
                            <GroupIcon /> Users
                        </Link>
                    </li>
                    <li className="p-4 hover:bg-blue-800 transition-colors rounded-lg mx-2">
                        <Link to="/roles" className="flex items-center gap-4">
                            <SecurityIcon /> Roles
                        </Link>
                    </li>
                    <li className="p-4 hover:bg-blue-800 transition-colors rounded-lg mx-2">
                        <Link to="/permissions" className="flex items-center gap-4">
                            <LockIcon /> Permissions
                        </Link>
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Sidebar;
