// import {useState} from "react";
// import {useNavigate} from "react-router-dom";
// import * as apiService from "../services/apiService.js"
// function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//
//     const navigate = useNavigate();
//
//     const handleLogin = async (e) => {
//         e.preventDefault()
//         setError('')
//
//         try {
//             const data = await apiService.login(email, password);
//             localStorage.setItem('token', data.token)
//             navigate('/users');
//         } catch (error) {
//             setError(error.message)
//             console.error('Login error:', error)
//         }
//     }
//
//     return (
//             <div >
//                 <h1 >Login</h1>
//                 {error && <p style={{color: 'red'}}>{error}</p>}
//                 <form onSubmit={handleLogin}>
//                     <div >
//                         <label htmlFor="email" >Email:</label>
//                         <input
//                             type="email"
//                             id="email"
//                             className="form-control"
//                             value={email}
//                             placeholder={"E-Mail"}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password">Password:</label>
//                         <input
//                             type="password"
//                             id="password"
//                             className="form-control"
//                             value={password}
//                             placeholder={'Password'}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="d-flex">
//                         <button type='submit'>Login</button>
//                     </div>
//                 </form>
//             </div>
//
//     )
// }
//
// export default LoginPage;