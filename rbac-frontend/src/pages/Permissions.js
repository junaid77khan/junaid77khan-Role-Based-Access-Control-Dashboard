import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Loader = () => (
    <div className="w-6 h-6 border-4 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
);

const Permissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', description: '' });
    const [editing, setEditing] = useState(false);
    const [currentPermission, setCurrentPermission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPermissions(res.data);
        } catch (err) {
            setError('Failed to fetch permissions');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editing) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/permissions/${currentPermission._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/permissions`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setForm({ name: '', description: '' });
            setEditing(false);
            setCurrentPermission(null);
            fetchPermissions();
        } catch (err) {
            setError(err.response.data.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = permission => {
        setForm({ name: permission.name, description: permission.description });
        setEditing(true);
        setCurrentPermission(permission);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/permissions/${permissionToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPermissions();
            setShowModal(false);
        } catch (err) {
            setError('Failed to delete permission');
        } finally {
            setLoading(false);
        }
    };

    const openModal = permission => {
        setPermissionToDelete(permission);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setPermissionToDelete(null);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 ">
                <Navbar />
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Permissions</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">{editing ? 'Edit Permission' : 'Add Permission'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Permission Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <input 
                                        type="text" 
                                        name="description" 
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-4">
                                <button type="submit" className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                                    {editing ? 'Update Permission' : 'Add Permission'}
                                </button>
                                {editing && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setEditing(false); setForm({ name: '', description: '' }); }}
                                        className="w-full sm:w-auto bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-2 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                            </div>
                    ) : (
                        <table className="min-w-full table-auto">
                            <thead className="bg-indigo-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 font-medium ">Name</th>
                                    <th className="px-4 py-2 font-medium ">Description</th>
                                    <th className="px-4 py-2 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map(permission => (
                                    <tr key={permission._id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{permission.name}</td>
                                        <td className="border px-4 py-2">{permission.description}</td>
                                        <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => handleEdit(permission)} 
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => openModal(permission)} 
                                                className="text-red-600 hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
                        <p className="text-gray-700 text-lg mb-4">
                            Deleting this permission will also remove it from the corresponding roles. Are you sure you want to delete it?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Permissions;
