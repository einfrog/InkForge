import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as apiService from '../services/apiService';
import './Header.css';

//for the login/logout/view profile functionality
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
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">InkForge</h1>

                <div className="header-nav">
                    <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Explore</Link>
                    <Link to="/socials" className={location.pathname === '/socials' ? 'nav-link active' : 'nav-link'}>Socials</Link>
                    <Link to="/projects" className={location.pathname === '/projects' ? 'nav-link active' : 'nav-link'}>Projects</Link>


                    <div className="profile-dropdown-wrapper">
                        <button
                            onClick={toggleDropdown}
                            className={`header-btn ${location.pathname === '/profile' ? 'active' : ''}`}
                        >
                            Profile
                        </button>


                        {showDropdown && (
                            <div className="profile-dropdown">
                            {isLoggedIn ? (
                                    <>
                                        <Link to={`/profile`} onClick={() => setShowDropdown(false)} className="dropdown-item dropdown-btn">View Profile</Link>
                                        <button onClick={() => { handleLogout(); setShowDropdown(false); }} className="dropdown-item dropdown-btn">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setShowDropdown(false)} className="dropdown-item dropdown-btn">Login</Link>
                                        <Link to="/register" onClick={() => setShowDropdown(false)} className="dropdown-item dropdown-btn">Register</Link>
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
