import {useEffect, useState} from 'react';
import {createUser, getUserById, updateUser} from '../services/apiService';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Header from "./Header.jsx";

function UserForm() {
    useEffect(() => {
        console.log("You made it to the user Form Page")

    }, []);

    // directly extracts id property from url (object destructuring syntax) and assigns it to variable id
    const {id} = useParams();
    // returns a function that lets you navigate programmatically in the browser in response to user interactions
    const navigate = useNavigate();

    // for loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // initial state of new user; has all properties but empty strings as values
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        biography: ''
    });
    // for error handling
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

    // if id changes call this
    useEffect(() => {
        if (id) {
            // if id is true, that means you're editing, and not creating anew user; so fetch the user and parse the values into the form
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
                    setCreateError(error.message || 'Failed to create user');
                }
            };
            void fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // clear errors and set loading state
        setCreateError('');
        setCreateSuccess('');
        setIsSubmitting(true);

        // clone the user object
        const userToSend = {...newUser};

        // remove the password field if it's just the placeholder
        if (userToSend.password === '********') {
            delete userToSend.password; //because swagger simply ignores the password field if it's not included in the request body, this is fine;
        }

        try {
            if (id) {
                // if id is true = you're editing a user, call updateUser from apiService and set CreateSuccess
                const updated = await updateUser(id, userToSend);
                setCreateSuccess(`User ${updated.username} updated successfully.`);
            } else {
                // if id is true = you're crating a new user, call create user from apiservice and setCreateSuccess
                const createdUser = await createUser(newUser);
                setCreateSuccess(`User ${createdUser.username} created successfully.`);

                // clear form fields, so new data can be entered;
                setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    biography: '',
                });
            }
            // navigate back to users (after timeout, so createSuccess can be displayed)
            setTimeout(() => {
                navigate('/socials');
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
                                        setNewUser({...newUser, password: ''}); // clear it for actual editing, spread to create copy of newUser, and then only edit password
                                    }
                                }}
                                onChange={(e) => setNewUser({
                                    ...newUser,
                                    password: e.target.value
                                })} //change password to target value
                                required={!id} // only required when creating a new user
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

                        <div className="d-flex">
                            {/*submit button that displays update/create and the loading state*/}
                            <button type="submit" className="btn btn-dark me-2" disabled={isSubmitting}>
                                {isSubmitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create User')}
                            </button>

                            <Link to='/socials' className="btn btn-dark">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {/*display error or create success*/}
                    {createError && <p className="text-danger mt-3">{createError}</p>}
                    {createSuccess && <p className="text-success mt-3">{createSuccess}</p>}
                </div>
            </div>

        </>
    )
}

export default UserForm;