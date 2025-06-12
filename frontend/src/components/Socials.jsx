import React, {useEffect, useState} from 'react';
import Header from "./Header.jsx";
import * as apiService from "../services/apiService.js";
import {Link, useNavigate} from "react-router-dom";

const Socials = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deletingUsers, setDeletingUsers] = useState({}); // Track which users are being deleted
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        setIsAdmin(apiService.isAdmin());

        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await apiService.getUsers(token);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message || 'Could not load users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        // Set this user as being deleted
        setDeletingUsers(prev => ({ ...prev, [userId]: true }));
        
        try {
            await apiService.deleteUser(userId);
            // Remove the deleted user from the list
            setUsers(users.filter(user => user.user_id !== userId));
        } catch (error) {
            setError(error.message || 'Failed to delete user');
        } finally {
            // Clear the deleting state for this user
            setDeletingUsers(prev => ({ ...prev, [userId]: false }));
        }
    };

    if (loading) return <p className="text-gray-500">Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Header/>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Find Users</h2>
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user.user_id} className="p-3 rounded shadow bg-white">
                            <p className="font-bold">{user.username}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.biography}</p>
                            <div className="mt-2">
                                <Link to={`/socials/${user.user_id}/`} className='btn btn-dark mx-2 my-1'>View</Link>
                                {isAdmin && (
                                    <>
                                        <Link to={`/socials/${user.user_id}/edit`} className='btn btn-dark mx-2 my-1'>Edit</Link>
                                        <button 
                                            onClick={() => handleDelete(user.user_id)} 
                                            className='btn btn-danger mx-2 my-1'
                                            disabled={deletingUsers[user.user_id]}
                                        >
                                            {deletingUsers[user.user_id] ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Socials;
