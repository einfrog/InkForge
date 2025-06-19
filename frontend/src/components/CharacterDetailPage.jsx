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
        // Clear any previous errors
        setError(null);

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
            // Display the specific error message from the backend
            setError(err.message || "Failed to save relationship.");
        }
    };

    const handleDelete = async (targetId) => {
        if (!window.confirm("Are you sure you want to delete this relationship?")) return;
        // Clear any previous errors
        setError(null);

        try {
            await apiService.deleteCharacterRelation(routeProjectId, characterId, targetId, token);
            const updated = await apiService.getCharacterRelationsById(routeProjectId, characterId, token);
            setRelations(updated.relations || []);
        } catch (err) {
            console.error("Failed to delete relationship:", err);
            setError(err.message || "Failed to delete relationship.");
        }
    };

    // Clear error when starting to edit or canceling
    const handleStartEdit = (targetId = 'new') => {
        setError(null);
        if (targetId === 'new') {
            setEditMode('new');
            setEditFields({target_character_id: "", relationship_type: "", notes: ""});
        } else {
            const rel = relations.find(r => r.target_character_id === targetId);
            setEditMode(targetId);
            setEditFields({
                target_character_id: rel.target_character_id,
                relationship_type: rel.relationship_type,
                notes: rel.notes || ''
            });
        }
    };

    const handleCancel = () => {
        setError(null);
        setEditMode(null);
        setEditFields({target_character_id: "", relationship_type: "", notes: ""});
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
                <main className="character-detail-container">
                    <section className="character-header card">
                        <img
                            src={character.image ? `http://localhost:5000${character.image}` : '/default-character.png'}
                            alt={character.name}
                            className="character-image"
                        />
                        <div className="character-info">
                            <h1 className="character-name">{character.name}</h1>
                            <p><strong>Role:</strong> {character.role || 'None specified'}</p>
                            <p><strong>Affiliated Project:</strong> {project.project_name}</p>
                        </div>
                    </section>

                    <section className="character-description segment">
                        <p><strong>Personality:</strong> {character.personality || 'No personality available'}</p>
                        <p><strong>Biography:</strong> {character.biography || 'No description available'}</p>
                        <p><strong>Description:</strong> {character.description || 'No description available'}</p>
                    </section>

                    <section className="relations-section segment">
                        <h2 className="segment__title">Relations</h2>

                        {/* Error Display - Show above the relations list */}
                        {error && (
                            <div className="error-message" style={{
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                color: '#c33',
                                padding: '10px',
                                borderRadius: '4px',
                                marginBottom: '15px'
                            }}>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {relations.length === 0 ? (
                            <p className="empty-text">No relations defined.</p>
                        ) : (
                            <ul className="relations-list">
                                {relations.map(rel => (
                                    <li key={rel.target_character_id} className="relation-item">
                                        <div>
                                            <span className="relation-label">Type:</span> {rel.relationship_type}
                                        </div>
                                        <div>
                                            <span className="relation-label">Target:</span> {rel.target_character_name}
                                        </div>
                                        <div>
                                            <span className="relation-label">Notes:</span> {rel.notes || 'None'}
                                        </div>
                                        {isOwner && (
                                            <div className="relation-actions">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-small"
                                                    onClick={() => handleStartEdit(rel.target_character_id)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-small"
                                                    onClick={() => handleDelete(rel.target_character_id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {isOwner && (
                            <>
                                {!editMode && (
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => handleStartEdit('new')}
                                    >
                                        Add Relationship
                                    </button>
                                )}
                                {editMode && (
                                    <form onSubmit={handleSave} className="relation-form mt-3">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="relationship_type">Relationship Type</label>
                                            <input
                                                id="relationship_type"
                                                type="text"
                                                className="form-input"
                                                value={editFields.relationship_type}
                                                onChange={e => setEditFields(f => ({...f, relationship_type: e.target.value}))}
                                                placeholder="e.g., Friend, Rival"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="target_character_id">Target Character</label>
                                            <select
                                                id="target_character_id"
                                                className="form-input"
                                                value={editFields.target_character_id}
                                                onChange={e => setEditFields(f => ({...f, target_character_id: e.target.value}))}
                                                required
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
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label" htmlFor="notes">Notes</label>
                                            <input
                                                id="notes"
                                                type="text"
                                                className="form-input"
                                                value={editFields.notes || ''}
                                                onChange={e => setEditFields(f => ({...f, notes: e.target.value}))}
                                                placeholder="Optional notes"
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-primary me-2">Save</button>
                                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default CharacterDetailPage;