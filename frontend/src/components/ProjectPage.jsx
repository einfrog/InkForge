import React, { useEffect, useState } from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import { Link } from "react-router-dom";
import './components.css';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingProjects, setDeletingProjects] = useState({});

    const fetchOwnProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await apiService.getOwnProjects(token);
            setProjects(response.projects || []);
            console.log('Fetched projects:', response.projects);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message || 'Could not load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnProjects();
    }, []);

    const handleDelete = async (projectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;

        setDeletingProjects(prev => ({ ...prev, [projectId]: true }));
        try {
            const token = localStorage.getItem('token');
            await apiService.deleteProject(projectId, token);
            await fetchOwnProjects(); // Refresh the project list
        } catch (error) {
            console.error(`Failed to delete project ${projectId}:`, error);
        } finally {
            setDeletingProjects(prev => ({ ...prev, [projectId]: false }));
        }
    };

    if (loading) return <div className="form-container"><p>Loading projects...</p></div>;
    if (error) return <div className="form-container"><p className="text-red-500">{error}</p></div>;

    return (
        <>
            <Header />
            <div className="segment">
                <h2 className="segment__title">Your Projects</h2>
                {projects.length > 0 ? (
                    <div className="grid-container">
                        {projects.map(project => (
                            <div key={project.project_id} className="card project-card">
                                <img
                                    src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                    alt={project.project_name}
                                    className="project-card__image"
                                />
                                <div className="project-card__content">
                                    <h3 className="project-card__title">{project.project_name}</h3>
                                    <p className="project-card__description">{project.category} • {project.genre}</p>
                                    <div className="flex gap-4 mt-4">
                                        <Link to={`${project.project_id}`} className="action-btn">View Project</Link>
                                        <Link to={`${project.project_id}/edit`} className="action-btn">Edit</Link>
                                        <button
                                            onClick={() => handleDelete(project.project_id)}
                                            className="alarm-btn"
                                            disabled={deletingProjects[project.project_id]}
                                        >
                                            {deletingProjects[project.project_id] ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No projects found.</p>
                )}
                <Link to="/projects-new" className="action-btn">Create New Project</Link>
            </div>
        </>
    );
};

export default ProjectPage;
