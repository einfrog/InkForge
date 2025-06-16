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

    useEffect(() => {
        const fetchProjectAndSettings = async () => {
            try {
                const response = await apiService.getProjectById(projectId, token);
                setProject(response.project);

                const settingsResponse = await apiService.getStorySettingsByProjectId(projectId, token);
                console.log("Settings response:", settingsResponse);
                setSettings(settingsResponse.settings);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjectAndSettings();
    }, [projectId, token]);

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
                    <p><strong>Geography:</strong> {project.geography || 'No geography available'}</p>
                    <p><strong>Climate:</strong> {settings.climate || 'No climate specified'}</p>
                    <p><strong>Time period:</strong> {settings.time_period || 'No time-period specified'}</p>
                    <p><strong>Culture:</strong> {settings.culture || 'No culture description available'}</p>
                    <p><strong>Notes:</strong> {settings.notes || 'No notes available'}</p>

                </div>
            </div>
        </div>
    );
}

export default WorldbuildingPage;