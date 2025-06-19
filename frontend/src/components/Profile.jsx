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
            <div className="userdetail-main">
                <div className="userdetail-card">
                    <div className="userdetail-header">
                        <div className="profile-image-container">
                            <ImageUpload
                                type="profile"
                                id={userId}
                                currentImage={user.profile_picture}
                                onImageUploaded={handleImageUploaded}
                                shape="circle"
                                size="medium"
                                variant="overlay"
                                className="user-profile-picture"
                            />
                        </div>
                        <div className="user-basic-info">
                            <h1 className="userdetail-title">{user.username}</h1>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>

                    <ul className="userdetail-list mt-4">
                        {/*<li><strong>ID:</strong> {user.user_id}</li>*/}
                        <li>{user.biography || <em>No biography yet</em>}</li>
                    </ul>

                    <div className="form-buttons">
                        <Link to={`/socials/${userId}/edit`} className="userdetail-btn me-2">
                            Edit Profile
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="alarm-btn"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );


}

export default Profile;
