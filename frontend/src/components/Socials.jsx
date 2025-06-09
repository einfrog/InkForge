import React, { useEffect, useState } from 'react';

const Socials = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/inkforge_users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setError('Could not load users');
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-gray-500">Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <ul className="space-y-2">
                {users.map(user => (
                    <li key={user.user_id} className="p-3 rounded shadow bg-white">
                        <p className="font-bold">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Socials;
