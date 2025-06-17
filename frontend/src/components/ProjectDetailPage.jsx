import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams, useLocation} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import './ProjectDetailPage.css';
import {jwtDecode} from "jwt-decode";

function ProjectDetailPage() {
    const [project, setProject] = useState({});
    const params = useParams();
    const location = useLocation();
    const projectId = params.id;

    //for loading states
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const isPublicView = location.pathname.startsWith('/explore/');
    const isOwner = project.user_id === getCurrentUserId();

    const getBackPath = () => {
        return isPublicView ? '/' : '/projects';
    };

    const getBackLabel = () => {
        return isPublicView ? 'Back to Explore' : 'Back to Projects';
    };

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                console.log("Fetching project with ID:", projectId);
                const response = await apiService.getProjectById(projectId, token);
                console.log("Full API response:", response);
                setProject(response.project);
            } catch (error) {
                console.error("Failed to fetch project: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProject();
    }, [projectId, token]);

    // const handleDelete = async () => {
    //     if (!isOwner) return;
    //
    //     if (!window.confirm('Are you sure you want to delete this project?')) return;
    //
    //     try {
    //         await apiService.deleteProject(projectId, token);
    //         navigate('/projects');
    //     } catch (error) {
    //         console.error('Error deleting project: ', error);
    //     }
    // };

    function getCurrentUserId() {
        let token = localStorage.getItem('token');
        let userId;
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.user_id || decoded.id || decoded.sub;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }

    if (isLoading) return <div className="project-detail-content"><p>Loading...</p></div>

    return (
        <div className="project-detail-root">
            <Header/>
            <div className="project-detail-main">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isOwner={isOwner}
                    isPublicView={isPublicView}
                    canEdit={isOwner && !isPublicView}
                />
                <div className="project-detail-content">
                    <div className="project-detail-layout">
                        <div className="project-detail-info">
                            <div className="project-detail-card">
                                <div className="project-detail-card-body">
                                    <h1 className="project-detail-title">{project.project_name}</h1>
                                    
                                    {isPublicView && (
                                        <div className="project-detail-list">
                                            <p><strong>By:</strong> {project.username || 'Unknown Author'}</p>
                                        </div>
                                    )}

                                    <ul className="project-detail-list">
                                        <li><strong>Category:</strong> {project.category}</li>
                                        <li><strong>Genre:</strong> {project.genre}</li>
                                        <li><strong>Description:</strong> {project.description || 'No description provided.'}</li>
                                        <li><strong>Visibility:</strong> {project.visibility}</li>
                                    </ul>

                                    <div className="project-detail-actions">
                                        <Link to={getBackPath()} className="project-detail-back-btn">
                                            {getBackLabel()}
                                        </Link>
                                        {isOwner && !isPublicView && (
                                            <Link to={`/projects/${projectId}/edit`} className="project-detail-back-btn">
                                                Edit Project
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="project-detail-cover-container">
                            <img
                                src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                alt={project.project_name}
                                className="project-detail-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetailPage;