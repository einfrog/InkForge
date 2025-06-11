// import React, {useEffect, useState} from 'react';
// import {Link, useNavigate} from 'react-router-dom';
// import * as apiService from '../services/apiService';
//
// function Header() {
//     // returns a function that lets you navigate programmatically in the browser in response to user interactions
//     const navigate = useNavigate();
//     // "state" lets component remember f.e. user input, can be updated directly, current state value and function to update it;
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//
//     //when component rerenders after a state change, react updates the browser dom, and then runs useEffect;
//     // useEffect runs after the component rerenders, only when the valuen in the dependency array change
//     // if the dependency array is left empty, useEffect runs once after rerender
//     useEffect(() => {
//         // effect's logic:
//         const token = localStorage.getItem('token');
//         setIsLoggedIn(!!token); //convert token into boolean (if it exists true, if it does not exist, false)
//     }, []);
//
//     const handleLogout = () => {
//         //pass navigate (function to programmatically navigate) to handlelogout function in the api service file
//         apiService.handleLogout(navigate);
//         setIsLoggedIn(false);
//     };
//
//     return (
//         <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <h1 style={{ margin: 0, color: "white" }}>InkForge</h1>
//
//                 <Link to="/socials">Socials</Link>
//                 <Link to="/register">Register</Link>
//                 <Link to="/profile">Profile</Link>
//
//
//                 <div>
//                     {isLoggedIn ? (
//                         <button onClick={handleLogout}>Logout</button>
//                     ) : (
//                         <Link to="/login">Login</Link>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }
//
// export default Header;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as apiService from '../services/apiService';

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (err) {
        console.error('Failed to decode token:', err);
        return null;
    }
}

function Header() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.user_id) {
                setUserId(decoded.user_id);
            }
        }
    }, []);

    const handleLogout = () => {
        apiService.handleLogout(navigate);
        setIsLoggedIn(false);
        setUserId(null);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, color: "white" }}>InkForge</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/">Explore</Link>
                    <Link to="/socials">Socials</Link>

                    <div style={{ position: 'relative' }}>
                        <button onClick={toggleDropdown} className="btn btn-dark">
                            Profile
                        </button>

                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                marginTop: '0.5rem',
                                zIndex: 1000,
                                minWidth: '150px'
                            }}>
                                {isLoggedIn ? (
                                    <>
                                        <Link to={`/profile`} onClick={() => setShowDropdown(false)} className="dropdown-item">View Profile</Link>
                                        <button onClick={() => { handleLogout(); setShowDropdown(false); }} className="dropdown-item btn btn-link">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setShowDropdown(false)} className="dropdown-item">Login</Link>
                                        <Link to="/register" onClick={() => setShowDropdown(false)} className="dropdown-item">Register</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
