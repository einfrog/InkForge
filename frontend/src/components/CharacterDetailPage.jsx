import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import * as apiService from "../services/apiService.js";
import {jwtDecode} from "jwt-decode";

function CharacterDetailPage() {
    const {project_id: routeProjectId, characterId} = useParams();
    const [character, setCharacter] = useState(null);
    const [project, setProject] = useState(null);
    const [relations, setRelations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");
    const location = useLocation();
    const [editMode, setEditMode] = useState(null); // current editing segmentId or 'new'
    const [editFields, setEditFields] = useState({target_character_id: "", relationship_type: ""});
    const [error, setError] = useState(null);
    const [allCharacters, setAllCharacters] = useState([]);
    const isPublicView = location.pathname.startsWith('/explore/');
    const isOwner = project?.user_id === getCurrentUserId();

    useEffect(() => {
        const fetchCharacterAndProject = async () => {
            try {
                const characterResponse = await apiService.getCharacterById(routeProjectId, characterId, token);
                const fetchedCharacter = characterResponse.character;
                setCharacter(fetchedCharacter);

                const projectIdToFetch = fetchedCharacter?.project_id || routeProjectId;
                const projectResponse = await apiService.getProjectById(projectIdToFetch, token);
                setProject(projectResponse.project);

                const allCharactersResponse = await apiService.getCharactersByProjectId(projectIdToFetch, token);
                setAllCharacters(allCharactersResponse.characters || []);
                console.log("Fetched all characters:", allCharactersResponse.characters);

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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editMode === 'new') {
                await apiService.addCharacterRelation(
                    routeProjectId,
                    characterId,
                    editFields,
                    token
                );
            } else {
                const projectId = project?.project_id || routeProjectId;

                await apiService.updateCharacterRelation(
                    projectId,
                    characterId,
                    editMode, // target_character_id
                    editFields,
                    token
                );
            }
            // Refresh relations
            const updated = await apiService.getCharacterRelationsById(routeProjectId, characterId, token);
            setRelations(updated.relations || []);
            setEditMode(null);
            setEditFields({target_character_id: "", relationship_type: ""});
        } catch (err) {
            console.error("Failed to save relationship:", err);
            setError("Failed to save relationship.");
        }
    };

    const handleDelete = async (targetId) => {
        if (!window.confirm("Are you sure you want to delete this character?")) return;
        try {
            await apiService.deleteCharacterRelation(routeProjectId, characterId, targetId, token);
            const updated = await apiService.getCharacterRelationsById(routeProjectId, characterId, token);
            setRelations(updated.relations || []);
        } catch (err) {
            console.error("Failed to delete relationship:", err);
            setError("Failed to delete relationship.");
        }
    };

    if (isLoading || !character || !project) return <div>Loading...</div>;

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
                    <div className="d-flex align-items-start mb-4">
                        <img
                            src={character.image ? `http://localhost:5000${character.image}` : '/default-character.png'}
                            alt={character.name}
                            className="rounded me-4"
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        />
                        <div>
                            <h1>{character.name}</h1>
                            <p><strong>Role:</strong> {character.role || 'None specified'}</p>
                            <p><strong>Affiliated Project:</strong> {project.project_name}</p>
                        </div>
                    </div>
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
                                    <strong>Type:</strong> {rel.relationship_type} <br/>
                                    <strong>Target-character-id:</strong> {rel.target_character_name} <br/>
                                    <strong>Notes:</strong> {rel.notes}

                                    {isOwner && (
                                        <>
                                            <button onClick={() => {
                                                setEditMode(rel.target_character_id);
                                                setEditFields({
                                                    target_character_id: rel.target_character_id,
                                                    relationship_type: rel.relationship_type
                                                });
                                            }}>Edit
                                            </button>
                                            <button onClick={() => handleDelete(rel.target_character_id)}>Delete
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {isOwner && (
                        <>
                    {!editMode && (
                        <button onClick={() => setEditMode('new')}>Add Relationship</button>
                    )}
                    {editMode && (

                        <form onSubmit={handleSave}>
                            <input
                                type="text"
                                value={editFields.relationship_type}
                                onChange={e => setEditFields(f => ({...f, relationship_type: e.target.value}))}
                                placeholder="Relationship Type"
                            />
                            <select
                                value={editFields.target_character_id}
                                onChange={e => setEditFields(f => ({...f, target_character_id: e.target.value}))}
                            >
                                <option value="">Select character</option>
                                {allCharacters
                                    .filter(c => c.character_id !== character.character_id)
                                    .map(c => (
                                        <option key={c.character_id} value={c.character_id}>
                                            {c.name}
                                        </option>
                                    ))}
                            </select>
                            <input
                                type="text"
                                value={editFields.notes || ''}
                                onChange={e => setEditFields(f => ({...f, notes: e.target.value}))}
                                placeholder="Notes"
                            />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setEditMode(null)}>Cancel</button>
                        </form>
                    )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

export default CharacterDetailPage;
