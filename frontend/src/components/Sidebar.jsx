import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ projectName, projectId }) {
    const location = useLocation();

    // Determine if we're in 'explore' or 'projects' based on the URL path
    const basePath = location.pathname.includes('/explore/') ? 'explore' : 'projects';

    return (
        <div className="sidebar">
            <h3>{projectName}</h3>
            <nav>
                <ul>
                    <li><Link to={`/${basePath}/${projectId}`}>Overview</Link></li>
                    <li><Link to={`/${basePath}/${projectId}/characters`}>Characters</Link></li>
                    <li><Link to={`/${basePath}/${projectId}/worldbuilding`}>Worldbuilding</Link></li>
                    <li><Link to={`/${basePath}/${projectId}/segments`}>Story Segments</Link></li>
                    <li><Link to={`/${basePath}/${projectId}/analytics`}>Analytics</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
