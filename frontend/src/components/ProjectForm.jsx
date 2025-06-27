import {useEffect, useState} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {createProject, getProjectById, updateProject, uploadProjectImage} from '../services/apiService';
import Header from "./Header.jsx";
import ImageUpload from './ImageUpload';
import './components.css';
import Footer from "./Footer.jsx";

function ProjectFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProject, setNewProject] = useState({
        project_name: '',
        category: '',
        genre: '',
        description: '',
        visibility: 'private',
        cover: null
    });

    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

    const [pendingCover, setPendingCover] = useState(null);
    const [pendingCoverFile, setPendingCoverFile] = useState(null);

    useEffect(() => {
        if (id) {
            console.log(`Editing project with ID: ${id}`);
            const fetchProject = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const projectData = await getProjectById(id, token);
                    console.log('Fetched project data:', projectData);
                    setNewProject({
                        project_name: projectData.project.project_name || '',
                        category: projectData.project.category || '',
                        genre: projectData.project.genre || '',
                        description: projectData.project.description || '',
                        visibility: projectData.project.visibility || 'private',
                        cover: projectData.project.cover || null
                    });
                } catch (error) {
                    setCreateError(error.message || 'Failed to fetch project');
                }
            };
            void fetchProject();
        }
    }, [id]);

    const handleImageUploaded = (path, file) => {
        console.log('Image uploaded, path:', path);
        setPendingCover(path);
        setPendingCoverFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setIsSubmitting(true);

        try {
            if (id) {
                // Edit mode
                const updatedProject = {
                    ...newProject,
                    cover: pendingCover || newProject.cover,
                    description: newProject.description.trim() === '' ? null : newProject.description
                };
                console.log('Updating project with:', updatedProject);
                await updateProject(id, updatedProject, localStorage.getItem('token'));
                setCreateSuccess(`Project "${newProject.project_name}" updated successfully.`);
            } else {
                // Create mode
                const projectData = {
                    ...newProject,
                    cover: null, // no cover yet
                    description: newProject.description.trim() === '' ? null : newProject.description
                };

                console.log('Creating project with:', projectData);
                const createdProject = await createProject(projectData, localStorage.getItem('token'));
                console.log('Project created:', createdProject);

                // Now upload the image if there's a pending one
                if (pendingCoverFile) {
                    console.log('Uploading image for new project');
                    await uploadProjectImage(createdProject.body.project.id, pendingCoverFile, localStorage.getItem('token'));
                    await updateProject(createdProject.body.project.id, {
                        ...projectData,
                        cover: pendingCover
                    }, localStorage.getItem('token'));
                }

                setCreateSuccess(`Project "${newProject.project_name}" created successfully.`);
                setNewProject({
                    project_name: '',
                    category: '',
                    genre: '',
                    description: '',
                    visibility: 'private',
                    cover: null
                });
                setPendingCover(null);
                setPendingCoverFile(null);
            }

            setTimeout(() => {
                navigate('/projects');
            }, 500);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setCreateError(error.message || 'Oops! Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Header />

            <div className="container character-form-container">
                <div className="card">

                    <h1 className="form__title">{id ? 'Edit Project' : 'Create New Project'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div>
                                <div className="form-group">
                                    <label htmlFor="project_name" className="form-label">Project Name</label>
                                    <input
                                        type="text"
                                        id="project_name"
                                        className="form-input"
                                        value={newProject.project_name}
                                        onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        id="category"
                                        className="form-input"
                                        value={newProject.category}
                                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Novel">Novel</option>
                                        <option value="Novelle">Novelle</option>
                                        <option value="Manga">Manga</option>
                                        <option value="Video Game">Video Game</option>
                                        <option value="Movie Script">Movie Script</option>
                                        <option value="Journal">Journal</option>
                                        <option value="Biography">Biography</option>
                                        <option value="Auto-Biography">Auto-Biography</option>
                                        <option value="Documentary">Documentary</option>
                                        <option value="Tutorial">Tutorial</option>
                                        <option value="DnD Campaign">DnD Campaign</option>
                                        <option value="Misc">Misc</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="genre" className="form-label">Genre</label>
                                    <select
                                        id="genre"
                                        className="form-input"
                                        value={newProject.genre}
                                        onChange={(e) => setNewProject({ ...newProject, genre: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a genre</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Sci-Fi">Sci-Fi</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Young Adult Fiction">Young Adult Fiction</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Dystopia">Dystopia</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Historical">Historical</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        className="form-input form-textarea"
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        rows="4"
                                        placeholder="Optionally enter project description here..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="visibility" className="form-label">Visibility</label>
                                    <select
                                        id="visibility"
                                        className="form-input"
                                        value={newProject.visibility}
                                        onChange={(e) => setNewProject({ ...newProject, visibility: e.target.value })}
                                    >
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <ImageUpload
                                    type="project"
                                    id={id}
                                    currentImage={pendingCover !== null ? pendingCover : newProject.cover}
                                    onImageUploaded={handleImageUploaded}
                                    shape="square"
                                    size="medium"
                                />
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="action-btn" disabled={isSubmitting}>
                                {isSubmitting
                                    ? (id ? 'Updating...' : 'Creating...')
                                    : (id ? 'Update' : 'Create Project')}
                            </button>
                            <Link to="/projects" className="cancel-btn">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {createError && <p>{createError}</p>}
                    {createSuccess && <p>{createSuccess}</p>}
                </div>
            </div>
            <Footer />

        </>
    );
}

export default ProjectFormPage;
