import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";
import ImageUpload from './ImageUpload';

function Profile() {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // decode token to get user ID
    let userId;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded.user_id || decoded.id || decoded.sub;
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            setIsLoading(true);
            try {
                const fetchedUser = await apiService.getUserById(userId, token);
                setUser(fetchedUser);
                console.log("Fetched user:", fetchedUser);
            } catch (error) {
                console.error("Failed to fetch user: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchUser();
    }, [userId, token]);

    const handleImageUploaded = async (path) => {
        try {
            // Update the user's profile picture in the database
            const updatedUser = await apiService.updateUser(userId, { profile_picture: path }, token);
            setUser(updatedUser);
            console.log("Profile picture updated:", updatedUser);
        } catch (error) {
            console.error("Failed to update profile picture:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        setIsDeleting(true);
        try {
            await apiService.deleteUser(userId);
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error("Failed to delete account: ", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="card shadow p-4">
                    <h1 className="mb-4">Profile</h1>
                    {user && (
                        <div>
                            <ImageUpload
                                type="profile"
                                id={userId}
                                currentImage={user.profile_picture}
                                onImageUploaded={handleImageUploaded}
                                shape="circle"
                                size="medium"
                                className="mb-4"
                            />
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Biography:</strong> {user.biography || 'No biography yet'}</p>
                            <div className="mt-4">
                                <Link to={`/socials/${userId}/edit`} className="btn btn-dark me-2">
                                    Edit Profile
                                </Link>
                                <button 
                                    onClick={handleDelete} 
                                    className="btn btn-danger"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Profile;
