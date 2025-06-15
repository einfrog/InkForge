import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import './ProjectDetailPage.css';

function ProjectDetailPage() {
    const [project, setProject] = useState({});
    const params = useParams();
    const projectId = params.id;

    //for loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const token = localStorage.getItem('token');

    // returns a function that lets you navigate programmatically in the browser in response to user interactions
    const navigate = useNavigate();

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

    // const handleDelete = async (userId) => {
    //     //alert window
    //     if (!window.confirm('Are you sure you want to delete this project?')) return;
    //
    //     setIsDeleting(true); //for loading state
    //     try {
    //         await apiService.deleteProject(userId);
    //         navigate('/projects');
    //     } catch (error) {
    //         console.error('Error deleting project: ', error);
    //     } finally {
    //         setIsDeleting(false); //for loading state
    //     }
    // };

    if (isLoading) return <div>Loading ... </div>

    return (
        <div className="project-detail-root">
            <Header/>
            <div className="project-detail-main">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                />
                <div className="project-detail-content">
                    <div className="project-detail-card">
                        <div className="project-detail-card-body">
                            <h1 className="project-detail-title">{project.project_name}</h1>
                            <ul className="project-detail-list">
                                <li><strong>ID:</strong> {project.project_id}</li>
                                <li><strong>Category:</strong> {project.category}</li>
                                <li><strong>Genre:</strong> {project.genre}</li>
                                <li><strong>Description:</strong> {project.description || 'No description provided.'}</li>
                                <li><strong>Visibility:</strong> {project.visibility}</li>
                            </ul>
                            <div className="project-detail-actions">
                                <Link to="/projects" className="project-detail-back-btn">
                                    Back to Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default ProjectDetailPage;