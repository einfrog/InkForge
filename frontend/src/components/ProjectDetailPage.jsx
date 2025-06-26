import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import './ProjectDetailPage.css';
import './components.css';
import {jwtDecode} from "jwt-decode";

function ProjectDetailPage() {
    const [project, setProject] = useState({});
    const [stats, setStats] = useState({characters: 0, segments: 0, words: 0, settings: 0});
    const params = useParams();
    const location = useLocation();
    const projectId = params.id;
    const [deletingProjects, setDeletingProjects] = useState({});


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
        // Fetch project stats
        const fetchStats = async () => {
            try {
                const statsResponse = await apiService.getProjectStats(projectId);
                setStats(statsResponse);
            } catch (error) {
                console.error("Failed to fetch project stats: ", error);
            }
        };
        fetchStats();
    }, [projectId]);

    const handleDelete = async () => {
        setDeletingProjects(true);
        if (!isOwner) return;

        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await apiService.deleteProject(project.project_id, token); // ✅ Correct
            navigate('/projects');
        } catch (error) {
            console.error(`Failed to delete project ${project.project_id}:`, error);
        } finally {
            setDeletingProjects(false);
        }
    };

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

    if (isLoading) return <div>Loading ... </div>

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
                    <section className="content-section">
                        <header className="content-section__header">
                            <h2 className="content-section__title">Overview</h2>
                            <div className="breadcrumb">
                                <Link to={'/projects'} className="breadcrumb-element">Projects</Link> <span
                                className="breadcrumb-element">{project.project_name}</span>
                            </div>
                            {isPublicView && (
                                <div className="project-owner">
                                    <p><strong>By:</strong> {project.username || 'Unknown Author'}</p>
                                </div>
                            )}
                        </header>

                        <div className="project-detail-top-row">
                            <div className="project-detail-info-stats">
                                <div className="project-detail-info">

                                    <ul>
                                        <li><strong>Category:</strong> {project.category}</li>
                                        <li><strong>Genre:</strong> {project.genre}</li>
                                        <li><strong>Visibility:</strong> {project.visibility}</li>
                                        <li><strong>Created
                                            at:</strong> {new Date(project.created_at).toLocaleDateString()}
                                        </li>
                                    </ul>
                                </div>

                                <div className="project-detail-stats">
                                    {/* Optional: owner info, actions */}

                                    <ul>
                                        <li><strong>Characters:</strong> {stats.characters}</li>
                                        <li><strong>Story Segments:</strong> {stats.segments}</li>
                                        <li><strong>Total Words:</strong> {stats.words}</li>
                                        <li><strong>Worldbuilding Settings:</strong> {stats.settings}</li>
                                    </ul>
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

                        <div className="project-detail-description">
                            <h2 className="content-section__title">Description</h2>
                            <p>{project.description || 'No description provided.'}</p>
                        </div>


                        <div className="form-buttons">
                            <Link to={getBackPath()} className="action-btn">
                                {getBackLabel()}
                            </Link>
                            {isOwner && !isPublicView && (
                                <>
                                    <Link to={`/projects/${projectId}/edit`} className="action-btn">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="alarm-btn"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}

export default ProjectDetailPage;