import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        permissions: [],
    });
    const [editing, setEditing] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [roleIdToDelete, setRoleIdToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(res.data);
        } catch (err) {
            setError('Failed to fetch roles');
        }
        setLoading(false);
    };

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPermissions(res.data);
        } catch (err) {
            setError('Failed to fetch permissions');
        }
        setLoading(false);
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        if (name === 'permissions') {
            if (checked) {
                setForm({ ...form, permissions: [...form.permissions, value] });
            } else {
                setForm({ ...form, permissions: form.permissions.filter(p => p !== value) });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editing) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/roles/${currentRole._id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/roles`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setForm({ name: '', permissions: [] });
            setEditing(false);
            setCurrentRole(null);
            fetchRoles();
        } catch (err) {
            setError(err.response.data.message || 'Operation failed');
        }
        setLoading(false);
    };

    const handleEdit = (role) => {
        setForm({
            name: role.name,
            permissions: role.permissions.map(p => p._id),
        });
        setEditing(true);
        setCurrentRole(role);
    };

    const handleDelete = (id) => {
        setRoleIdToDelete(id);
        setIsPopupVisible(true);
    };

    const confirmDelete = async () => {
        setIsPopupVisible(false);
        setLoading(true);
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/roles/${roleIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRoles();
        } catch (err) {
            setError('Failed to delete role');
        }
        setLoading(false);
    };

    const cancelDelete = () => {
        setIsPopupVisible(false);
        setRoleIdToDelete(null);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-6">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Roles</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">{editing ? 'Edit Role' : 'Add Role'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-40 overflow-y-auto">
                                    {permissions.map(permission => (
                                        <div key={permission._id} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="permissions" 
                                                value={permission._id}
                                                checked={form.permissions.includes(permission._id)}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">{permission.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                >
                                    {editing ? 'Update Role' : 'Add Role'}
                                </button>
                                {editing && (
                                    <button 
                                        type="button" 
                                        onClick={() => { setEditing(false); setForm({ name: '', permissions: [] }); }}
                                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                                <div className="w-8 h-8 border-2 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                            </div>
                    ) : (
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-indigo-600 text-white">
                                        <th className="px-4 py-3 text-left">Role Name</th>
                                        <th className="px-4 py-3 text-left">Permissions</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map(role => (
                                        <tr key={role._id} className="border-b border-gray-200">
                                            <td className="px-4 py-3">{role.name}</td>
                                            <td className="px-4 py-3">{role.permissions.map(p => p.name).join(', ')}</td>
                                            <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(role)} 
                                                    className="text-blue-600 hover:text-blue-500"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(role._id)} 
                                                    className="text-red-600 hover:text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {isPopupVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg">
                        <p className="text-gray-700 text-lg mb-4">
                            Are you sure you want to delete this role? Deleting this role will also delete all associated users.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roles;
