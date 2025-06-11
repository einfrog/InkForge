import React, {useEffect, useState} from 'react';
import Header from "./Header.jsx";
import * as apiService from "../services/apiService.js";

const Socials = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiService.getUsers();
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
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Socials;
