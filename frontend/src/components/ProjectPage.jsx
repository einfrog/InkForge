import React, {useEffect, useState} from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import {Link} from "react-router-dom";

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnProjects = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await apiService.getOwnProjects(token);

                console.log("API response:", response);

                // Correctly extract the projects array
                setProjects(response.projects || []);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message || 'Could not load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchOwnProjects();
    }, []);

    if (loading) return <p className="text-gray-500">Loading projects...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            <Header/>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Your projects</h2>
                {projects.length > 0 ? (
                    <ul className="space-y-2">
                        {projects.map(project => (
                            <li
                                key={project.project_id}
                                className="p-3 rounded shadow bg-white"
                            >
                                <p className="font-bold">{project.project_name}</p>
                                <p className="text-sm text-gray-600">{project.category}</p>
                                <p className="text-sm text-gray-600">{project.genre}</p>
                                <div>
                                    <Link to={`${project.project_id}`}>View Project</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No projects found.</p>
                )}
            </div>
        </>
    );
};

export default ProjectPage;
