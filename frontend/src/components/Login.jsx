import {useState} from "react";
import {useNavigate} from "react-router-dom";
import * as apiService from "../services/apiService.js"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await fetch('/api/auth/login', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ email, password })
    //         });
    //
    //         if (!res.ok) {
    //             const text = await res.text(); // try to read raw text if not JSON
    //             throw new Error(`Login failed: ${text}`);
    //         }
    //
    //         const data = await res.json();
    //         console.log("Login successful", data);
    //         // redirect or update state
    //     } catch (error) {
    //         console.error("Login error:", error);
    //     }
    // };

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
            <div >
                <h1 >Login</h1>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div >
                        <label htmlFor="email" >Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            placeholder={"E-Mail"}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            placeholder={'Password'}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-flex">
                        <button type='submit'>Login</button>
                    </div>
                </form>
            </div>

    )
}

export default LoginPage;