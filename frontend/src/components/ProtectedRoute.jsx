import {Navigate, useLocation, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getProjectById} from '../services/apiService';
import {jwtDecode} from 'jwt-decode';

function ProtectedRoute({children}) {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const params = useParams();
    const [accessAllowed, setAccessAllowed] = useState(true);
    const [checked, setChecked] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isProjectRoute = location.pathname.startsWith('/projects/') || location.pathname.startsWith('/explore/');
    const projectId = location.pathname.split('/')[2];

    useEffect(() => {
        const checkAccess = async () => {
            if (!isProjectRoute) {
                setChecked(true);
                setAccessAllowed(true);
                return;
            }
            try {
                const response = await getProjectById(projectId, token);
                const project = response.project;
                if (project.visibility === 'public') {
                    setAccessAllowed(true);
                } else if (location.pathname.startsWith('/explore/')) {
                    setAccessAllowed(false);
                    setErrorMsg('You have no access to this private project.');
                } else {
                    let userId;
                    try {
                        const decoded = jwtDecode(token);
                        userId = decoded.user_id || decoded.id || decoded.sub;
                    } catch (e) {
                        userId = null;
                    }
                    if (userId && project.user_id === userId) {
                        setAccessAllowed(true);
                    } else {
                        setAccessAllowed(false);
                        setErrorMsg('You have no access to this private project.');
                    }
                }
            } catch (e) {
                setAccessAllowed(false);
                setErrorMsg('Project not found or no access..');
            } finally {
                setChecked(true);
            }
        };
        if (token) {
            checkAccess();
        }
    }, [token, isProjectRoute, projectId, location.pathname]);

    if (!token) {
        return <Navigate to='/login' replace/>;
    }

    if (!checked) {
        return <div>Checking access ...</div>;
    }

    if (!accessAllowed) {
        return <div style={{color: 'red', padding: 20}}>{errorMsg}</div>;
    }

    return children;
}

export default ProtectedRoute;