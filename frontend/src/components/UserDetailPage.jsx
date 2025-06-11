import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";

function UserDetailPage() {
    const [user, setUser] = useState({});
    // useParams() hook from React Router provides an object containing URL parameters
    const params = useParams();
    //set userID to params.id; because in routers it's defined that way (in app.jsx)
    const userId = params.id;

    //for loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    if (isLoading) return <div>Loading ... </div>

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header/>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">

                <div className="container mt-5 w-50">
                    <div className="card transparent-item border-white">
                        <div className="card-body">
                            <h1 className="card-title display-5 ms-3">{user.username} </h1>
                            <ul>
                                <li className="list-group-item lead">
                                    <strong>ID:</strong> {user.user_id}
                                </li>
                                <li className="list-group-item lead">
                                    <strong>Username:</strong> {user.username}
                                </li>
                                <li className="list-group-item lead">
                                    <strong>Email:</strong> {user.email}
                                </li>
                                <li className="list-group-item lead">
                                    <strong>Biography:</strong> {user.biography || 'No biography provided.'}
                                </li>

                            </ul>

                            <div className="d-flex flex-wrap gap-2 mt-3 ms-2">
                                {/*link to userformpage for editing*/}
                                {/*<Link to={`/socials/${user.user_id}/edit`} className="btn btn-dark">Edit</Link>*/}
                                {/*link back to users*/}
                                <Link to="/socials" className="btn btn-dark">Back to Users</Link>
                                {/*delete button that call handleDelete and displays loading state*/}
                                {/*<button*/}
                                {/*    className="btn btn-danger"*/}
                                {/*    onClick={() => handleDelete(user.id)}*/}
                                {/*    disabled={isDeleting}*/}
                                {/*>*/}
                                {/*    {isDeleting ? 'Deleting...' : 'Delete'}*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default UserDetailPage;