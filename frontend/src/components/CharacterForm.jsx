import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {createCharacter, getCharacterById, updateCharacter, uploadCharacterImage} from '../services/apiService';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import ImageUpload from './ImageUpload';
import './components.css';

function CharacterForm() {
    const {id, characterId} = useParams();
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

    const [pendingImage, setPendingImage] = useState(null);
    const [pendingImageFile, setPendingImageFile] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleImageUploaded = (path, file) => {
        console.log('Image uploaded, path:', path);
        setPendingImage(path);
        setPendingImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        const characterToSend = {
            ...character,
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
                const createdCharacter = await createCharacter(id, characterToSend, localStorage.getItem('token'));

                // Now upload the image if there's a pending one
                if (pendingImageFile) {
                    console.log('Uploading image for new character');
                    await uploadCharacterImage(createdCharacter.characterId, pendingImageFile, localStorage.getItem('token'));
                    await updateCharacter(id, createdCharacter.characterId, {
                        ...characterToSend,
                        image: pendingImage
                    }, localStorage.getItem('token'));
                }

                setSuccess(`Character "${character.name}" created successfully.`);
                setCharacter({
                    name: '',
                    role: '',
                    personality: '',
                    biography: '',
                    description: '',
                    image: null
                });
                setPendingImage(null);
                setPendingImageFile(null);
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
        <div className="page-container">
            <Header/>

            <div className="container mt-5 mb-5 character-form-container">
                <div className="card">
                    <h1 className="form__title">{characterId ? 'Edit Character' : 'Create New Character'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-input"
                                        value={character.name}
                                        onChange={(e) => setCharacter({...character, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select
                                        id="role"
                                        className="form-input"
                                        value={character.role}
                                        onChange={(e) => setCharacter({...character, role: e.target.value})}
                                        required
                                    >
                                        <option value="">Select a role</option>
                                        <option value="Protagonist">Protagonist</option>
                                        <option value="Main Protagonist">Main Protagonist</option>
                                        <option value="Antagonist">Antagonist</option>
                                        <option value="Main Antagonist">Main Antagonist</option>
                                        <option value="Supporting Character">Supporting Character</option>
                                        <option value="Ally">Ally</option>
                                        <option value="Love Interest">Love Interest</option>
                                        <option value="Mentor">Mentor</option>
                                        <option value="Comic Relief">Comic Relief</option>
                                        <option value="Narrator">Narrator</option>
                                        <option value="Villain">Villain</option>
                                        <option value="Background Character">Background Character</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="personality" className="form-label">Personality</label>
                                    <textarea
                                        id="personality"
                                        className="form-input form-textarea"
                                        value={character.personality}
                                        onChange={(e) => setCharacter({...character, personality: e.target.value})}
                                        placeholder="Describe the character's personality"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="biography" className="form-label">Biography</label>
                                    <textarea
                                        id="biography"
                                        className="form-input form-textarea"
                                        value={character.biography}
                                        onChange={(e) => setCharacter({...character, biography: e.target.value})}
                                        placeholder="Character biography (optional)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="form-input form-textarea"
                                        value={character.description}
                                        onChange={(e) => setCharacter({...character, description: e.target.value})}
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

                        <div className="form-buttons">
                            <button type="submit" className="action-btn" disabled={isSubmitting}>
                                {isSubmitting
                                    ? (characterId ? 'Updating...' : 'Creating...')
                                    : (characterId ? 'Update' : 'Create Character')}
                            </button>
                            <Link to={`/projects/${id}/characters`} className="cancel-btn">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {error && <p className="text-danger mt-3">{error}</p>}
                    {success && <p className="text-success mt-3">{success}</p>}
                </div>
            </div>
            <Footer />
        </div>


    )


}

export default CharacterForm;
