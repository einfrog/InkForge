import {Navigate} from 'react-router-dom';

function ProtectedRoute ( {children}) {
    //save token from localstorage in const token
    const token = localStorage.getItem('token');

    //checked if you're logged in (if you have a token), if not, redirected to login
    if(!token){
        return <Navigate to='/login' replace/>  //automatic redirection of user to /login
    }

    //if logged in, return child of component (see app.jsx for that)
    return children;
}

export default ProtectedRoute;