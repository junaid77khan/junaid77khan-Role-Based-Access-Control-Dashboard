import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRoles, setTotalRoles] = useState(0);
    const [totalPermissions, setTotalPermissions] = useState(0);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/count`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTotalUsers(response.data.totalUsers);
            } catch (error) {}
        };

        const fetchTotalRoles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles/count`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTotalRoles(response.data.totalRoles);
            } catch (error) {}
        };

        const fetchTotalPermissions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/permissions/count`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTotalPermissions(response.data.totalPermissions);
            } catch (error) {}
        };

        const fetchRecentActivities = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/activity/recent`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRecentActivities(response.data);
            } catch (error) {}
        };

        fetchTotalUsers();
        fetchTotalRoles();
        fetchTotalPermissions();
        fetchRecentActivities();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 bg-gray-50">
                <Navbar />
                <div className="p-6 md:px-12 lg:px-16">
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h2 className="text-3xl font-semibold text-blue-700">Welcome to the RBAC Dashboard</h2>
                        <p className="text-gray-600 mt-2">
                            Manage roles, users, and permissions with ease. Stay organized and secure.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Total Users</h3>
                            <p className="text-3xl font-bold">{totalUsers}</p>
                        </div>
                        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Total Roles</h3>
                            <p className="text-3xl font-bold">{totalRoles}</p>
                        </div>
                        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                            <h3 className="text-xl font-semibold">Permissions Assigned</h3>
                            <p className="text-3xl font-bold">{totalPermissions}</p>
                        </div>
                    </div>
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-blue-700">Recent Activity</h3>
                        <ul className="mt-4 space-y-4">
                            {recentActivities.length === 0 ? (
                                <li className="text-gray-600">No recent activity</li>
                            ) : (
                                recentActivities.map((activity) => (
                                    <li className="flex items-center" key={activity._id}>
                                        <span className="text-gray-600">
                                            {activity.action} - {activity.user} {activity.role ? `with role ${activity.role}` : ''}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
