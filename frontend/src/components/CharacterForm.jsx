import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createCharacter, getCharacterById, updateCharacter } from '../services/apiService';
import Header from "./Header.jsx";
import ImageUpload from './ImageUpload';

function CharacterForm() {
    const { id, characterId } = useParams();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [character, setCharacter] = useState({
        name: '',
        role: '',
        personality: '',
        biography: '',
        description: '',
        image: null
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [pendingImage, setPendingImage] = useState(null);

    useEffect(() => {
        if (characterId) {
            console.log(`Editing character with ID: ${characterId}`);
            const fetchCharacter = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const characterData = await getCharacterById(id, characterId, token);
                    console.log('Fetched character data:', characterData);
                    setCharacter({
                        name: characterData.character.name || '',
                        role: characterData.character.role || '',
                        personality: characterData.character.personality || '',
                        biography: characterData.character.biography || '',
                        description: characterData.character.description || '',
                        image: characterData.character.image || null
                    });
                } catch (error) {
                    setError(error.message || 'Failed to fetch character');
                }
            };
            void fetchCharacter();
        }
    }, [characterId]);

    const handleImageUploaded = async (path) => {
        console.log('Image uploaded, path:', path);
        setPendingImage(path);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        const characterToSend = {
            ...character,
            // Optional: trim empty strings to null if needed
            image: pendingImage || character.image,
            biography: character.biography.trim() === '' ? null : character.biography,
            description: character.description.trim() === '' ? null : character.description
        };

        try {
            if (characterId) {
                console.log('Project ID:', id);

                await updateCharacter(id, characterId, characterToSend, localStorage.getItem('token'));

                setSuccess(`Character "${character.name}" updated successfully.`);
            } else {
                await createCharacter(id, characterToSend, localStorage.getItem('token'));
                setSuccess(`Character "${character.name}" created successfully.`);
                setCharacter({
                    name: '',
                    role: '',
                    personality: '',
                    biography: '',
                    description: '',
                    image: pendingImage || null
                });
            }

            setTimeout(() => {
                navigate(`/projects/${id}/characters`);
            }, 500);
        } catch (error) {
            setError(error.message || 'Oops! Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />

            <div className="container mt-5 mb-5">
                <div className="card shadow p-4 transparent-item border-white">
                    <h1 className="mb-4 display-5">{characterId ? 'Edit Character' : 'Create New Character'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={character.name}
                                        onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <input
                                        type="text"
                                        id="role"
                                        className="form-control"
                                        value={character.role}
                                        onChange={(e) => setCharacter({ ...character, role: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="personality" className="form-label">Personality</label>
                                    <textarea
                                        id="personality"
                                        className="form-control"
                                        value={character.personality}
                                        onChange={(e) => setCharacter({ ...character, personality: e.target.value })}
                                        placeholder="Describe the character's personality"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="biography" className="form-label">Biography</label>
                                    <textarea
                                        id="biography"
                                        className="form-control"
                                        value={character.biography}
                                        onChange={(e) => setCharacter({ ...character, biography: e.target.value })}
                                        placeholder="Character biography (optional)"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        value={character.description}
                                        onChange={(e) => setCharacter({ ...character, description: e.target.value })}
                                        placeholder="Additional description (optional)"
                                    />
                                </div>
                            </div>

                            <div className="col-md-4">
                                <ImageUpload
                                    type="character"
                                    id={characterId}
                                    currentImage={pendingImage !== null ? pendingImage : character.image}
                                    onImageUploaded={handleImageUploaded}
                                    shape="square"
                                    size="medium"
                                />
                            </div>
                        </div>

                        <div className="d-flex">
                            <button type="submit" className="btn btn-dark me-2" disabled={isSubmitting}>
                                {isSubmitting ? (characterId ? 'Updating...' : 'Creating...') : (characterId ? 'Update' : 'Create Character')}
                            </button>

                            <Link to={`/projects/${id}/characters`} className="btn btn-dark">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {error && <p className="text-danger mt-3">{error}</p>}
                    {success && <p className="text-success mt-3">{success}</p>}
                </div>
            </div>
        </>
    );
}

export default CharacterForm;
