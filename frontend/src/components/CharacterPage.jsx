import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import {jwtDecode} from "jwt-decode";
import './components.css';

function CharacterPage() {
    const [project, setProject] = useState({});
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {id: projectId} = useParams();
    const location = useLocation();
    const [deletingCharacter, setDeletingCharacter] = useState({});
    const token = localStorage.getItem('token');

    const isPublicView = location.pathname.startsWith('/explore/');
    const isOwner = project.user_id === getCurrentUserId();
    const canEdit = isOwner && !isPublicView;

    const getCharacterDetailPath = (characterId) => {
        return isPublicView
            ? `/explore/${projectId}/characters/${characterId}`
            : `/projects/${projectId}/characters/${characterId}`;
    };

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
        let userId;
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.user_id || decoded.id || decoded.sub;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }

    const handleDelete = async (characterId) => {
        if (!window.confirm("Are you sure you want to delete this character?")) return;

        try {
            await apiService.deleteCharacter(projectId, characterId, token);
            // Remove deleted character from state to update UI:
            setCharacters((prevChars) => prevChars.filter((c) => c.character_id !== characterId));
        } catch (error) {
            console.error("Failed to delete character:", error);
            alert("Failed to delete character, please try again.");
        }
    };

    if (isLoading) return <div className="form-container"><p>Loading...</p></div>;

    return (
        <div className="project-detail-root">
            <Header/>
            <div className="project-detail-main d-flex flex-row">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isPublicView={isPublicView}
                />
                <div className="segment flex-grow-1">
                    <h2 className="segment__title">Characters</h2>
                    {characters.length > 0 ? (
                        <div className="grid-container character-container">
                            {characters.map((char) => (
                                <div key={char.character_id} className="card character-card">
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
                                        <p className="character-card__description">{char.description}</p>
                                        <div className="flex gap-4 mt-4">
                                            <Link
                                                to={getCharacterDetailPath(char.character_id)}
                                                className="action-btn"
                                            >
                                                View Profile
                                            </Link>
                                            {isOwner && (
                                                <>
                                                    <Link
                                                        to={`/projects/${projectId}/characters/${char.character_id}/edit`}
                                                        className="action-btn"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(char.character_id)}
                                                        className="alarm-btn"
                                                        disabled={deletingCharacter[char.character_id]}
                                                    >
                                                        {deletingCharacter[char.character_id] ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
    );
}

export default CharacterPage;
