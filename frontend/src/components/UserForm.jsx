import {useEffect, useState} from 'react';
import {createUser, getUserById, updateUser} from '../services/apiService';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Header from "./Header.jsx";
import * as apiService from '../services/apiService';

function UserForm() {
    useEffect(() => {
        console.log("You made it to the user Form Page")

    }, []);

    // directly extracts id property from url (object destructuring syntax) and assigns it to variable id
    const {id} = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        biography: ''
    });

    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

    useEffect(() => {
        // Check if user is admin
        setIsAdmin(apiService.isAdmin());

        // Check if editing own profile
        const token = localStorage.getItem('token');
        if (token && id) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setIsOwnProfile(decoded.user_id === parseInt(id));
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        if (id) {
            const fetchUser = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const userData = await getUserById(id, token);
                    setNewUser({
                        username: userData.username,
                        email: userData.email,
                        password: '********',
                        biography: userData.biography,
                    });
                } catch (error) {
                    setCreateError(error.message || 'Failed to fetch user');
                }
            };
            void fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setIsSubmitting(true);

        const userToSend = {...newUser};
        if (userToSend.password === '********') {
            delete userToSend.password;
        }

        try {
            if (id) {
                const updated = await updateUser(id, userToSend);
                setCreateSuccess(`User ${updated.username} updated successfully.`);
            } else {
                const { user, token } = await createUser(newUser);
                localStorage.setItem('token', token);
                setCreateSuccess(`User ${user.username} created successfully.`);
                setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    biography: '',
                });
            }
            setTimeout(() => {
                // If editing and it's not own profile (admin editing another user), go to user detail page
                if (id && !isOwnProfile) {
                    navigate(`/socials/${id}`);
                } else {
                    // If creating new user or editing own profile, go to profile page
                    navigate(id ? `/profile` : '/socials');
                }
            }, 500);
        } catch (error) {
            setCreateError(error.message || 'Oops! Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header/>
            <div className="container mt-5 mb-5 w-25">
                <div className="card shadow p-4 transparent-item border-white">
                    <h1 className="mb-4 display-5">{id ? 'Edit User' : 'Create New User'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Username</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={newUser.username}
                                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={newUser.email}
                                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={newUser.password}
                                onFocus={() => {
                                    if (newUser.password === '********') {
                                        setNewUser({...newUser, password: ''});
                                    }
                                }}
                                onChange={(e) => setNewUser({
                                    ...newUser,
                                    password: e.target.value
                                })}
                                required={!id}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="info" className="form-label">Biography</label>
                            <textarea
                                id="biography"
                                className="form-control"
                                value={newUser.biography}
                                onChange={(e) => setNewUser({...newUser, biography: e.target.value})}
                            />
                        </div>

                        {/*<div className="mb-3">*/}
                        {/*    <label htmlFor="info" className="form-label">Passwort</label>*/}
                        {/*    <textarea*/}
                        {/*        id="password"*/}
                        {/*        className="form-control"*/}
                        {/*        value={newUser.password}*/}
                        {/*        onChange={(e) => setNewUser({...newUser, password: e.target.value})}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="d-flex">
                            <button type="submit" className="btn btn-dark me-2" disabled={isSubmitting}>
                                {isSubmitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create User')}
                            </button>

                            <Link to={id ? `/socials/${id}` : '/socials'} className="btn btn-dark">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {createError && <p className="text-danger mt-3">{createError}</p>}
                    {createSuccess && <p className="text-success mt-3">{createSuccess}</p>}
                </div>
            </div>
        </>
    )
}

export default UserForm;