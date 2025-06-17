import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import {jwtDecode} from "jwt-decode";

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

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="project-detail-root">
            <Header/>
            <div className="project-detail-main d-flex flex-row">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isPublicView={isPublicView}
                />
                <div className="flex-grow-1 p-4">
                    <h1>Characters</h1>
                    {characters.length > 0 ? (
                        <ul className="list-group">
                            {characters.map((char) => (
                                <li key={char.character_id} className="list-group-item">
                                    <div className="d-flex align-items-center mb-2">
                                        <img
                                            src={char.image ? `http://localhost:5000${char.image}` : '/default-character.png'}
                                            alt={char.name}
                                            className="rounded me-3"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <strong>{char.name}</strong> - {char.role || 'No role'}
                                        </div>
                                    </div>
                                    <p>{char.biography}</p>
                                    <div>
                                        <Link
                                            to={getCharacterDetailPath(char.character_id)}
                                        >
                                            View Profile
                                        </Link>
                                        {isOwner && (
                                            <>
                                                <Link
                                                    to={`/projects/${projectId}/characters/${char.character_id}/edit`}>Edit</Link>


                                                
                                                <button
                                                    onClick={() => handleDelete(char.character_id)}
                                                    className="userform-btn"
                                                    disabled={deletingCharacter[char.character_id]}
                                                >
                                                    {deletingCharacter[char.character_id] ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No characters found for this project.</p>
                    )}
                    {isOwner && (
                        <Link to={`/projects/${project.project_id}/characters/new`}
                              className="block mt-4 text-blue-600 underline">New Character</Link>
                    )}


                </div>

            </div>

        </div>
    );
}

export default CharacterPage;
