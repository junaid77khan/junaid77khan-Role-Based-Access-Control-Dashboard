
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem('token')) navigate("/login");
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-b from-blue-700 to-blue-900 p-4 flex justify-between items-center shadow-lg">
            <h1 className="text-white text-2xl font-semibold tracking-wider text-center w-full 
                lg:text-2xl lg:block sm:text-xl sm:pt-6 sm:px-4">
                <span className="hidden sm:block">Role-Based Access Control Dashboard</span> 
                <span className="block sm:hidden">Dashboard</span>
            </h1>

            <button
                onClick={handleLogout}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 focus:outline-none"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
