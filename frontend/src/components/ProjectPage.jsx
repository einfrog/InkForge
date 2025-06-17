import React, { useEffect, useState } from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import { Link } from "react-router-dom";

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

    if (loading) return <p className="text-gray-500">Loading projects...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Header />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Your projects</h2>
                {projects.length > 0 ? (
                    <ul className="space-y-2">
                        {projects.map(project => (
                            <li
                                key={project.project_id}
                                className="p-3 rounded shadow bg-white"
                            >
                                <img
                                    src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                    alt={project.project_name}
                                    className="rounded me-3"
                                    style={{width: '100px', height: '100px', objectFit: 'cover'}}
                                />
                                <p className="font-bold">{project.project_name}</p>
                                <p className="text-sm text-gray-600">{project.category}</p>
                                <p className="text-sm text-gray-600">{project.genre}</p>
                                <div className="space-x-4 mt-2">
                                    <Link to={`${project.project_id}`}>View Project</Link>
                                    <Link to={`${project.project_id}/edit`}>Edit Project</Link>
                                    <button
                                        onClick={() => handleDelete(project.project_id)}
                                        className="userform-btn"
                                        disabled={deletingProjects[project.project_id]}
                                    >
                                        {deletingProjects[project.project_id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No projects found.</p>
                )}
                <Link to="/projects-new" className="block mt-4 text-blue-600 underline">New Project</Link>
            </div>
        </>
    );
};

export default ProjectPage;
