import React, {useEffect, useState} from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import {Link} from "react-router-dom";
import './components.css';
import Footer from "./Footer.jsx";

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
                <div className="title-container">
                    <h2 className="segment__title">Explore Projects</h2>
                    {publicProjects.length > 0 ? (
                        <div className="grid-container">
                            {publicProjects.map(project => (
                                <Link
                                    to={`explore/${project.project_id}`}
                                    key={project.project_id}
                                    className="card project-card project-card--link"
                                >
                                    <img
                                        src={project.cover ? `http://localhost:5000${project.cover}` : '/default-project.png'}
                                        alt={project.project_name}
                                        className="project-card__image"
                                    />
                                    <div className="project-card__content">
                                        <h3 className="project-card__title">{project.project_name}</h3>
                                        <p className="project-card__description">By: {project.username || 'Unknown Author'}</p>
                                        <p className="project-card__description">{project.category} • {project.genre}</p>
                                    </div>
                                </Link>

                            ))}
                        </div>
                    ) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </div>
            <Footer/>

        </>
    );
}

export default Explore;