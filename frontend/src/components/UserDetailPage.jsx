import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";
import './UserPages.css';
import ImageUpload from "./ImageUpload.jsx";
import './components.css';

function UserDetailPage() {
    const [user, setUser] = useState({});
    // useParams() hook from React Router provides an object containing URL parameters
    const params = useParams();
    //set userID to params.id; because in routers it's defined that way (in app.jsx)
    const userId = params.id;

    //for loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return '/default-profile.png';
        if (path.startsWith('http')) return path;
        return `http://localhost:5000${path}`;
    };

    const token = localStorage.getItem('token');

    // returns a function that lets you navigate programmatically in the browser in response to user interactions
    const navigate = useNavigate();

    //when component loads or userId or token is changed, run this
    useEffect(() => {
        // asynchronous function fetchUser
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                // await response from getUserByID, which returns a user object; setUser to the returned user object
                setUser(await apiService.getUserById(userId, token));
            } catch (error) {
                console.error("Failed to fetch user: ", error);
            } finally {
                setIsLoading(false);
            }
        }
        // actually calls fetchUser
        void fetchUser();
    }, [userId, token]);

    const handleDelete = async (userId) => {
        //alert window
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        setIsDeleting(true); //for loading state
        try {
            // await deleteuser and then navigate to /users
            await apiService.deleteUser(userId);
            navigate('/users');
        } catch (error) {
            console.error('Error deleting user: ', error);
        } finally {
            setIsDeleting(false); //for loading state
        }
    };

    const handleImageUploaded = (path) => {
        setUser(prev => ({ ...prev, profile_picture: path }));
    };


    if (isLoading) return <div>Loading ... </div>

    return (
        <div className="userdetail-root">
            <Header />
            <div className="userdetail-main">
                <div className="userdetail-card">
                    <div className="userdetail-header">
                        <img
                            src={getImageUrl(user.profile_picture)}
                            alt={`${user.username}'s profile`}
                            className="user-profile-picture"
                        />
                        <div className="user-basic-info">
                            <h1 className="userdetail-title">{user.username}</h1>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>

                    <ul className="userdetail-list">
                        <li><strong>ID:</strong> {user.user_id}</li>
                        <li>
                            <strong>Biography:</strong>{' '}
                            {user.biography || <em>No biography provided.</em>}
                        </li>
                    </ul>

                    <div className="userdetail-actions">
                        <Link to="/socials" className="userdetail-btn">
                            Back to Users
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );



}

export default UserDetailPage;