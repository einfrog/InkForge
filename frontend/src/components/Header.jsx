import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import * as apiService from '../services/apiService';

function Header() {
    // returns a function that lets you navigate programmatically in the browser in response to user interactions
    const navigate = useNavigate();
    // "state" lets component remember f.e. user input, can be updated directly, current state value and function to update it;
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //when component rerenders after a state change, react updates the browser dom, and then runs useEffect;
    // useEffect runs after the component rerenders, only when the valuen in the dependency array change
    // if the dependency array is left empty, useEffect runs once after rerender
    useEffect(() => {
        // effect's logic:
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); //convert token into boolean (if it exists true, if it does not exist, false)
    }, []);

    const handleLogout = () => {
        //pass navigate (function to programmatically navigate) to handlelogout function in the api service file
        apiService.handleLogout(navigate);
        setIsLoggedIn(false);
    };

    return (
        <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, color: "white" }}>InkForge</h1>

                <Link to="/socials">Socials</Link>
                <Link to="/register">Register</Link>


                <div>
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;