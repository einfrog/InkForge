import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import {jwtDecode} from "jwt-decode";
import './components.css';
import Footer from "./Footer.jsx";

function CharacterPage() {
    const [project, setProject] = useState({});
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {id: projectId} = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const isPublicView = location.pathname.startsWith('/explore/');
    const isOwner = project.user_id === getCurrentUserId();

    useEffect(() => {
        const fetchProjectAndCharacters = async () => {
            try {
                const projectResponse = await apiService.getProjectById(projectId, token);
                setProject(projectResponse.project);

                const charactersResponse = await apiService.getCharactersByProjectId(projectId, token);
                console.log("Characters response:", charactersResponse);
                setCharacters(charactersResponse.characters);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjectAndCharacters();
    }, [projectId, token]);

    function getCurrentUserId() {
        let token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.user_id || decoded.id || decoded.sub;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }

    if (isLoading) return <div><p>Loading...</p></div>;

    return (
        <div className="project-detail-root">
            <Header/>
            <div className="project-detail-main d-flex flex-row">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isPublicView={isPublicView}
                />
                <div className="project-detail-content">
                    <div className="content-section">
                        <div className="content-section__header">
                            <h2 className="content-section__title">Characters</h2>
                            <div className="breadcrumb">
                                <Link to={'/projects'} className="breadcrumb-element">Projects</Link><Link
                                to={`/projects/${projectId}`}
                                className="breadcrumb-element">{project.project_name}</Link><span
                                className="breadcrumb-element">Characters</span>
                            </div>
                        </div>

                        {characters.length > 0 ? (
                            <div className="grid-container character-container">
                                {characters.map((char) => (
                                    <Link to={`${char.character_id}`} key={char.character_id}
                                          className="card character-card">
                                        <div className="character-card__header">
                                            <div className="character-card__image-container">
                                                <img
                                                    src={char.image ? `http://localhost:5000${char.image}` : '/default-character.png'}
                                                    alt={char.name}
                                                    className="character-card__image"
                                                />
                                            </div>
                                            <div className="character-card__title-group">
                                                <h3 className="character-card__name">{char.name}</h3>
                                                <p className="character-card__role">{char.role || 'No role'}</p>
                                            </div>
                                        </div>
                                        <div className="character-card__content">
                                            <p className="character-card__description">
                                                {char.description && char.description.trim() !== ''
                                                    ? char.description
                                                    : "No description."}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p>No characters found for this project.</p>
                        )}
                        {isOwner && (
                            <Link
                                to={`/projects/${project.project_id}/characters/new`}
                                className="action-btn"
                            >
                                Create New Character
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>

        </div>
    );
}

export default CharacterPage;
