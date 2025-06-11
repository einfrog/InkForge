// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
//
// function RegisterForm() {
//     const navigate = useNavigate();
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         biography: ''
//     });
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//         setIsSubmitting(true);
//
//         // Validate passwords match
//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             setIsSubmitting(false);
//             return;
//         }
//
//         try {
//             const response = await fetch('http://localhost:5000/api/inkforge_users/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     username: formData.username,
//                     email: formData.email,
//                     password: formData.password,
//                     biography: formData.biography
//                 })
//             });
//
//             const data = await response.json();
//
//             if (!response.ok) {
//                 throw new Error(data.error || 'Registration failed');
//             }
//
//             setSuccess('Registration successful! Redirecting to login...');
//             setTimeout(() => {
//                 navigate('/login');
//             }, 2000);
//
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <>
//             <Header />
//             <div className="container mt-5 mb-5 w-25">
//                 <div className="card shadow p-4 transparent-item border-white">
//                     <h1 className="mb-4 display-5">Register</h1>
//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label htmlFor="username" className="form-label">Username</label>
//                             <input
//                                 type="text"
//                                 id="username"
//                                 className="form-control"
//                                 value={formData.username}
//                                 onChange={(e) => setFormData({...formData, username: e.target.value})}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label htmlFor="email" className="form-label">Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 className="form-control"
//                                 value={formData.email}
//                                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label htmlFor="password" className="form-label">Password</label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 className="form-control"
//                                 value={formData.password}
//                                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//                             <input
//                                 type="password"
//                                 id="confirmPassword"
//                                 className="form-control"
//                                 value={formData.confirmPassword}
//                                 onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                                 required
//                             />
//                         </div>
//
//                         <div className="mb-3">
//                             <label htmlFor="biography" className="form-label">Biography</label>
//                             <textarea
//                                 id="biography"
//                                 className="form-control"
//                                 value={formData.biography}
//                                 onChange={(e) => setFormData({...formData, biography: e.target.value})}
//                                 required
//                             />
//                         </div>
//
//                         <div className="d-flex">
//                             <button
//                                 type="submit"
//                                 className="btn btn-dark me-2"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? 'Registering...' : 'Register'}
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn btn-dark"
//                                 onClick={() => navigate('/login')}
//                             >
//                                 Back to Login
//                             </button>
//                         </div>
//                     </form>
//
//                     {error && <p className="text-danger mt-3">{error}</p>}
//                     {success && <p className="text-success mt-3">{success}</p>}
//                 </div>
//             </div>
//         </>
//     );
// }
//
// export default RegisterForm;