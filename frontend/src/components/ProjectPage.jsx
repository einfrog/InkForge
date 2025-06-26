import React, {useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import * as apiService from '../services/apiService';
import {Link} from "react-router-dom";
import './components.css';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    if (loading) return <div ><p>Loading projects...</p></div>;
    if (error) return <div ><p className="text-red-500">{error}</p></div>;

    return (
        <>
            <Header/>
            <div className="segment">
                <div className="title-container">
                    <h2 className="segment__title">Your Projects</h2>
                    {projects.length > 0 ? (
                        <div className="grid-container">
                            {projects.map(project => (

                                <Link to={`${project.project_id}`} key={project.project_id} className="card project-card project-card--link">
                                    <img
                                        src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                        alt={project.project_name}
                                        className="project-card__image"
                                    />
                                    <div className="project-card__content">
                                        <h3 className="project-card__title">{project.project_name}</h3>
                                        <p className="project-card__description">{project.category} • {project.genre}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No projects found.</p>
                    )}
                    <Link to="/projects-new" className="action-btn">Create New Project</Link>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProjectPage;
