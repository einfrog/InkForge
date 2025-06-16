import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import * as apiService from "../services/apiService.js";

function CharacterDetailPage() {
    const { project_id: routeProjectId, characterId } = useParams();
    const [character, setCharacter] = useState(null);
    const [project, setProject] = useState(null);
    const [relations, setRelations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");
    const location = useLocation();

    const isPublicView = location.pathname.startsWith('/explore/');

    useEffect(() => {
        const fetchCharacterAndProject = async () => {
            try {
                const characterResponse = await apiService.getCharacterById(routeProjectId, characterId, token);
                const fetchedCharacter = characterResponse.character;
                setCharacter(fetchedCharacter);

                const projectIdToFetch = fetchedCharacter?.project_id || routeProjectId;
                const projectResponse = await apiService.getProjectById(projectIdToFetch, token);
                setProject(projectResponse.project);
                const relationsResponse = await apiService.getCharacterRelationsById(routeProjectId, characterId, token);
                setRelations(relationsResponse.relations || []);
                console.log("Fetched character relations:", relationsResponse.relations);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchCharacterAndProject();
    }, [routeProjectId, characterId, token]);

    if (isLoading || !character || !project) return <div>Loading...</div>;

    return (
        <div className="project-detail-root">
            <Header />
            <div className="project-detail-main d-flex flex-row">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isPublicView={isPublicView}
                />
                <div className="flex-grow-1 p-4">
                    <h1>{character.name}</h1>
                    <p><strong>Role:</strong> {character.role || 'None specified'}</p>
                    <p><strong>Affiliated Project:</strong> {project.project_name}</p>
                    <p><strong>Personality:</strong> {character.personality || 'No personality available'}</p>
                    <p><strong>Biography:</strong> {character.biography || 'No description available'}</p>
                    <p><strong>Description:</strong> {character.description || 'No description available'}</p>
                    <h2>Relations</h2>
                    {relations.length === 0 ? (
                        <p>No relations defined.</p>
                    ) : (
                        <ul>
                            {relations.map(rel => (
                                <li key={rel.target_character_id}>
                                    <strong>Type:</strong> {rel.relationship_type} <br />
                                    <strong>Target-character-id:</strong> {rel.target_character_id} <br />
                                    <strong>Notes:</strong> {rel.notes}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CharacterDetailPage;
