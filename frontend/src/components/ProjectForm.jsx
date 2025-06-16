import {useEffect, useState} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {createProject, getProjectById, updateProject} from '../services/apiService';
import Header from "./Header.jsx";

function ProjectFormPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProject, setNewProject] = useState({
        project_name: '',
        category: '',
        genre: '',
        description: '',
        visibility: 'private'
    });

    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

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
                        visibility: projectData.project.visibility || 'private'
                    });
                } catch (error) {
                    setCreateError(error.message || 'Failed to fetch project');
                }
            };
            void fetchProject();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');
        setIsSubmitting(true);

        const projectToSend = {
            ...newProject,
            description: newProject.description.trim() === '' ? null : newProject.description
        };

        try {
            if (id) {
                await updateProject(id, projectToSend, localStorage.getItem('token'));
                setCreateSuccess(`Project "${newProject.project_name}" updated successfully.`);
            } else {
                await createProject(projectToSend, localStorage.getItem('token'));
                setCreateSuccess(`Project "${newProject.project_name}" created successfully.`);
                setNewProject({
                    project_name: '',
                    category: '',
                    genre: '',
                    description: '',
                    visibility: 'private'
                });
            }

            setTimeout(() => {
                navigate('/projects');
            }, 500);
        } catch (error) {
            setCreateError(error.message || 'Oops! Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />

            <div className="container mt-5 mb-5 w-25">
                <div className="card shadow p-4 transparent-item border-white">
                    <h1 className="mb-4 display-5">{id ? 'Edit Project' : 'Create New Project'}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="project_name" className="form-label">Project Name</label>
                            <input
                                type="text"
                                id="project_name"
                                className="form-control"
                                value={newProject.project_name}
                                onChange={(e) => setNewProject({...newProject, project_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <input
                                type="text"
                                id="category"
                                className="form-control"
                                value={newProject.category}
                                onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="genre" className="form-label">Genre</label>
                            <input
                                type="text"
                                id="genre"
                                className="form-control"
                                value={newProject.genre}
                                onChange={(e) => setNewProject({...newProject, genre: e.target.value})}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea
                                id="description"
                                className="form-control"
                                placeholder="Optional"
                                value={newProject.description}
                                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="visibility" className="form-label">Visibility</label>
                            <select
                                id="visibility"
                                className="form-select"
                                value={newProject.visibility}
                                onChange={(e) => setNewProject({...newProject, visibility: e.target.value})}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>

                        <div className="d-flex">
                            <button type="submit" className="btn btn-dark me-2" disabled={isSubmitting}>
                                {isSubmitting ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create Project')}
                            </button>

                            <Link to="/projects" className="btn btn-dark">
                                Cancel
                            </Link>
                        </div>
                    </form>

                    {createError && <p className="text-danger mt-3">{createError}</p>}
                    {createSuccess && <p className="text-success mt-3">{createSuccess}</p>}
                </div>
            </div>
        </>
    );
}

export default ProjectFormPage;
