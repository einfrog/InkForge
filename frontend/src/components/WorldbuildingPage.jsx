import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function WorldbuildingPage() {
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await apiService.getProjectById(projectId, token);
                setProject(response.project);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProject();
    }, [projectId, token]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="project-detail-root">
            <Header />
            <div className="project-detail-main d-flex flex-row">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                />
                <div className="flex-grow-1 p-4">
                    <h1>Worldbuilding Page</h1>
                    <p>This is the worldbidling page.</p>
                </div>
            </div>
        </div>
    );
}

export default WorldbuildingPage;