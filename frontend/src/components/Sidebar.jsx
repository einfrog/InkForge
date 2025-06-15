import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './Sidebar.css';

function Sidebar({projectName, projectId, isOwner, isPublicView, canEdit}) {
    const location = useLocation();

    const getBasePath = () => {
        return isPublicView ? `/explore/${projectId}` : `/projects/${projectId}`;
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>{projectName}</h3>

            </div>

            <nav className="sidebar-nav">
                <div>
                    <Link
                        to={getBasePath()}
                        className={`sidebar-link ${isActiveLink(getBasePath()) ? 'active' : ''}`}
                    >
                        Overview
                    </Link>
                </div>
                <div>

                    <Link
                        to={`${getBasePath()}/characters`}
                        className={`sidebar-link ${isActiveLink(`${getBasePath()}/characters`) ? 'active' : ''}`}
                    >
                        Characters
                    </Link>
                </div>
                <div>

                    <Link
                        to={`${getBasePath()}/worldbuilding`}
                        className={`sidebar-link ${isActiveLink(`${getBasePath()}/worldbuilding`) ? 'active' : ''}`}
                    >
                        Worldbuilding
                    </Link>
                </div>
                <div>

                    <Link
                        to={`${getBasePath()}/segments`}
                        className={`sidebar-link ${isActiveLink(`${getBasePath()}/segments`) ? 'active' : ''}`}
                    >
                        Story Segments
                    </Link>
                </div>

                <div>

                    <Link
                        to={`${getBasePath()}/analytics`}
                        className={`sidebar-link ${isActiveLink(`${getBasePath()}/analytics`) ? 'active' : ''}`}
                    >
                        Analytics
                    </Link>
                </div>

            </nav>
        </div>
    );
}

export default Sidebar;
