import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js"
import './UserPages.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        console.log('Login button clicked')
        setError('')

        try {
            console.log('Attempting login with:', { email, password })
            const data = await apiService.login(email, password);
            console.log('Login successful, received data:', data)
            localStorage.setItem('token', data.token)
            navigate('/socials');
        } catch (error) {
            console.error('Login error:', error)
            setError(error.message)
        }
    }

    return (
            <div className="login-root">
                <h1 className="login-title">Login</h1>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleLogin} className="login-main">
                    <div style={{width: '100%'}}>
                        <label htmlFor="email" className="login-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="login-input"
                            value={email}
                            placeholder={"E-Mail"}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{width: '100%'}}>
                        <label htmlFor="password" className="login-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="login-input"
                            value={password}
                            placeholder={'Password'}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-actions">
                        <button type='submit' className="login-btn">Login</button>
                    </div>
                </form>
            </div>

    )
}

export default LoginPage;