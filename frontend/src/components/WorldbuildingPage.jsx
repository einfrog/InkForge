import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Sidebar from "./Sidebar.jsx";
import './components.css';

function WorldbuildingPage() {
    const [project, setProject] = useState({});
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {id: projectId} = useParams();
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
        setEditMode((prev) => ({...prev, [field]: true}));
        setSuccess(null);
        setError(null);
    };

    const handleCancel = (field) => {
        setEditMode((prev) => ({...prev, [field]: false}));
        setEditFields((prev) => ({...prev, [field]: settings[field] || ''}));
        setSuccess(null);
        setError(null);
    };

    const handleChange = (field, value) => {
        setEditFields((prev) => ({...prev, [field]: value}));
    };

    const handleSave = async (field) => {
        try {
            await apiService.createOrUpdateSetting(projectId, field, editFields[field], token, !!settings[field]);
            setSettings((prev) => ({...prev, [field]: editFields[field]}));
            setEditMode((prev) => ({...prev, [field]: false}));
            setSuccess(`${field} saved!`);
        } catch (e) {
            setError(e.message);
        }
    };

    const handleDelete = async (field) => {
        try {
            await apiService.deleteSetting(projectId, field, token);
            setSettings((prev) => ({...prev, [field]: ''}));
            setEditFields((prev) => ({...prev, [field]: ''}));
            setSuccess(`${field} deleted!`);
        } catch (e) {
            setError(e.message);
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
                <div className="project-detail-content">
                    <div className="content-section">
                        <div className="content-section__header">
                            <h2 className="content-section__title">Worldbuilding Settings</h2>
                            <div className="breadcrumb">
                                <Link to={'/projects'} className="breadcrumb-element">Projects</Link> <Link
                                to={`/projects/${projectId}`}
                                className="breadcrumb-element">{project.project_name}</Link> <span
                                className="breadcrumb-element">Worldbuilding</span>
                            </div>
                        </div>


                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {success && <div className="text-green-500 mb-4">{success}</div>}

                        <div className="content-grid">
                            {['geography', 'climate', 'time_period', 'political_system', 'culture', 'note'].map((field) => (
                                <div key={field} className="content-item">
                                    <h3 className="content-item__title">
                                        {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h3>
                                    {editMode[field] ? (
                                        <div className="flex flex-col gap-4">
                                            <input
                                                type="text"
                                                value={editFields[field]}
                                                onChange={e => handleChange(field, e.target.value)}
                                                className="form-input"
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSave(field)} className="action-btn">Save
                                                </button>
                                                <button onClick={() => handleCancel(field)}
                                                        className="cancel-btn">Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="content-item__content">
                                            <p>{settings[field] || <em>No setting set</em>}</p>
                                            {!isPublicView && (
                                                <div className="flex gap-2 mt-4">
                                                    <button onClick={() => handleEdit(field)}
                                                            className="action-btn">Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(field)}
                                                            className="alarm-btn">Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default WorldbuildingPage;