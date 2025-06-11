import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";

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
            } catch (error) {
                console.error("Failed to fetch user: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchUser();
    }, [userId, token]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setIsDeleting(true);
        try {
            await apiService.deleteUser(userId);
            navigate('/users');
        } catch (error) {
            console.error('Error deleting user: ', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div>Loading ...</div>;

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="container mt-5 w-50">
                    <div className="card transparent-item border-white">
                        <div className="card-body">
                            <h1 className="card-title display-5 ms-3">{user.username}</h1>
                            <ul>
                                <li className="list-group-item lead"><strong>ID:</strong> {user.user_id}</li>
                                <li className="list-group-item lead"><strong>Username:</strong> {user.username}</li>
                                <li className="list-group-item lead"><strong>Email:</strong> {user.email}</li>
                                <li className="list-group-item lead"><strong>Biography:</strong> {user.biography || 'No biography provided.'}</li>
                            </ul>
                            <div className="d-flex flex-wrap gap-2 mt-3 ms-2">
                                <Link to={`/socials/${user.user_id}/edit`} className="btn btn-dark">Edit</Link>
                                {/*<button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>*/}
                                {/*    {isDeleting ? 'Deleting...' : 'Delete'}*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
