import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js"
import './UserPages.css';
import './components.css';

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
            navigate('/projects');
        } catch (error) {
            console.error('Login error:', error)
            setError(error.message)
        }
    }

    return (
        <div className="form-page">
            <div className="form-container card" style={{ maxWidth: '400px' }}>
                <h1 className="form__title">Login</h1>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={email}
                            placeholder="E-Mail"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <button type="submit" className="login-btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;