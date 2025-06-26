import React, {useEffect, useState} from 'react';
import Header from "./Header.jsx";
import * as apiService from "../services/apiService.js";
import {Link, useNavigate} from "react-router-dom";
import './UserPages.css';

const Socials = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deletingUsers, setDeletingUsers] = useState({}); // Track which users are being deleted
    const navigate = useNavigate();

    const getImageUrl = (path) => {
        if (!path) return '/default-profile.png';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    useEffect(() => {
        // Check if user is admin
        setIsAdmin(apiService.isAdmin());

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const data = await apiService.getUsers(token);
                setUsers(data);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message || 'Could not load users');
            } finally {
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

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="userform-error">{error}</p>;

    return (
        <>
            <Header/>
            <div className="socials-root">
                <h2 className="users_title">Find Users</h2>
                <ul className="socials-list">
                    {users.map(user => (
                        <li key={user.user_id} className="socials-list-item">
                            <div className="user-profile-header">
                                <img
                                    src={getImageUrl(user.profile_picture)}
                                    alt={`${user.username}'s profile`}
                                    className="user-profile-picture"
                                />
                                <div className="user-info">
                                    <p className="font-bold">{user.username}</p>
                                    <p style={{fontSize: '0.95rem', color: '#555'}}>{user.email}</p>
                                </div>
                            </div>
                            {/*<p style={{fontSize: '0.95rem', color: '#555', marginTop: '1rem'}}>{user.biography}</p>*/}
                            <div className="socials-actions">
                                <Link to={`/socials/${user.user_id}/`} className='userform-btn'>View</Link>
                                {isAdmin && (
                                    <>
                                        <Link to={`/socials/${user.user_id}/edit`} className='userform-btn'>Edit</Link>
                                        <button
                                            onClick={() => handleDelete(user.user_id)} 
                                            className='userform-btn'
                                            style={{background: '#b91c1c'}}
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
