import React, {useState, useEffect} from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import {Link} from "react-router-dom";
import './components.css';

const Explore = () => {
    const [publicProjects, setPublicProjects] = useState([]);

    useEffect(() => {
        const fetchPublicProjects = async () => {
            try {
                const data = await apiService.getPublicProjects();
                console.log('Public projects:', data);
                setPublicProjects(data.projects);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPublicProjects();
    }, []);

    return (
        <>
            <Header/>
            <div className="segment">
                <h2 className="segment__title">Explore Projects</h2>
                {publicProjects.length > 0 ? (
                    <div className="grid-container">
                        {publicProjects.map(project => (
                            <div key={project.project_id} className="card project-card">
                                <img
                                    src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                    alt={project.project_name}
                                    className="project-card__image"
                                />
                                <div className="project-card__content">
                                    <h3 className="project-card__title">{project.project_name}</h3>
                                    <p className="project-card__description">By: {project.username || 'Unknown Author'}</p>
                                    <p className="project-card__description">{project.category} • {project.genre}</p>
                                    <div className="flex gap-4 mt-4">
                                        <Link to={`explore/${project.project_id}`} className="btn btn-primary">
                                            View Project
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </>
    );
}

export default Explore;