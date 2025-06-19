import {useEffect, useState} from 'react';
import {createUser, getUserById, updateUser} from '../services/apiService';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Header from "./Header.jsx";
import * as apiService from '../services/apiService';
import './UserPages.css';
import './components.css';

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
                    // navigate(id ? `/profile` : '/socials');
                    navigate(`/profile`);

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
            <Header />

            <div className="container mt-5 mb-5 character-form-container">
                <div className="card">
                    <h1 className="segment__title">{id ? 'Edit User' : 'Create New Profile'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-input"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={newUser.password}
                                onFocus={() => {
                                    if (newUser.password === '********') {
                                        setNewUser({ ...newUser, password: '' });
                                    }
                                }}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required={!id}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="biography" className="form-label">Biography</label>
                            <textarea
                                id="biography"
                                className="form-input form-textarea"
                                value={newUser.biography}
                                onChange={(e) => setNewUser({ ...newUser, biography: e.target.value })}
                                placeholder="Write something about yourself"
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="action-btn" disabled={isSubmitting}>
                                {isSubmitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create Profile')}
                            </button>
                            <Link to={id ? `/profile` : '/socials'} className="cancel-btn">
                                Cancel
                            </Link>
                        </div>

                        {createError && <p className="form-error">{createError}</p>}
                        {createSuccess && <p className="form-success">{createSuccess}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserForm;

