import React, {useState, useEffect} from 'react';
import Header from './Header';
import * as apiService from '../services/apiService';
import {Link} from "react-router-dom";

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

            <div >
                <h2 >Explore Projects</h2>
                {publicProjects.length > 0 ? (
                    <ul className="space-y-2">
                        {publicProjects.map(project => (
                            <li
                                key={project.project_id}
                                className="p-3 rounded shadow bg-white"
                            >
                                <p className="font-bold">{project.project_name}</p>
                                <p className="text-sm text-gray-600">{project.category}</p>
                                <p className="text-sm text-gray-600">{project.genre}</p>
                                <div>
                                    <Link to={`explore/${project.project_id}`}>View Project</Link>
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
}

export default Explore;