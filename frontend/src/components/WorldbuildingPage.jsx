import {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function WorldbuildingPage() {
    const [project, setProject] = useState({});
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const token = localStorage.getItem('token');
    const location = useLocation();

    const isPublicView = location.pathname.startsWith('/explore/');

    const [editFields, setEditFields] = useState({
        geography: '',
        climate: '',
        time_period: '',
        political_system: '',
        culture: '',
        note: ''
    });
    const [editMode, setEditMode] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProjectAndSettings = async () => {
            try {
                const response = await apiService.getProjectById(projectId, token);
                setProject(response.project);

                const settingsResponse = await apiService.getStorySettingsByProjectId(projectId, token);
                console.log("Settings response:", settingsResponse);
                setSettings(settingsResponse.settings);
                setEditFields({
                    geography: settingsResponse.settings.geography || '',
                    climate: settingsResponse.settings.climate || '',
                    time_period: settingsResponse.settings.time_period || '',
                    political_system: settingsResponse.settings.political_system || '',
                    culture: settingsResponse.settings.culture || '',
                    note: settingsResponse.settings.note || ''
                });
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjectAndSettings();
    }, [projectId, token]);

    const handleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
        setSuccess(null);
        setError(null);
    };

    const handleCancel = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: false }));
        setEditFields((prev) => ({ ...prev, [field]: settings[field] || '' }));
        setSuccess(null);
        setError(null);
    };

    const handleChange = (field, value) => {
        setEditFields((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async (field) => {
        try {
            await apiService.createOrUpdateSetting(projectId, field, editFields[field], token, !!settings[field]);
            setSettings((prev) => ({ ...prev, [field]: editFields[field] }));
            setEditMode((prev) => ({ ...prev, [field]: false }));
            setSuccess(`${field} saved!`);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDelete = async (field) => {
        try {
            await apiService.deleteSetting(projectId, field, token);
            setSettings((prev) => ({ ...prev, [field]: '' }));
            setEditFields((prev) => ({ ...prev, [field]: '' }));
            setSuccess(`${field} deleted!`);
        } catch (e) {
            setError(e.message);
        }
    };

    if (isLoading) return <div>Loading...</div>;

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
                    <h1>Worldbuilding Page</h1>
                    <p>This is the worldbidling page.</p>

                    <h2>Project Settings</h2>
                    <p><strong>Project Name:</strong> {project.project_name}</p>

                    {error && <div style={{color: 'red'}}>{error}</div>}
                    {success && <div style={{color: 'green'}}>{success}</div>}

                    {/* Settings Felder */}
                    {['geography', 'climate', 'time_period', 'political_system', 'culture', 'note'].map((field) => (
                        <div key={field} style={{marginBottom: '1rem'}}>
                            <strong>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                            {editMode[field] ? (
                                <>
                                    <input
                                        type="text"
                                        value={editFields[field]}
                                        onChange={e => handleChange(field, e.target.value)}
                                        style={{width: '60%'}}
                                    />
                                    <button onClick={() => handleSave(field)} style={{marginLeft: 8}}>Save</button>
                                    <button onClick={() => handleCancel(field)} style={{marginLeft: 4}}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{settings[field] || <em>No setting set</em>}</span>
                                    {!isPublicView && (
                                        <>
                                            <button onClick={() => handleEdit(field)} style={{marginLeft: 8}}>Edit</button>
                                            <button onClick={() => handleDelete(field)} style={{marginLeft: 4, color: 'red'}}>Delete</button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default WorldbuildingPage;