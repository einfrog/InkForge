import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import CharacterGraph from './CharacterGraph.jsx';

function AnalyticsPage() {
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const token = localStorage.getItem('token');
    const location = useLocation();
    const [graphData, setGraphData] = useState(null);
    const [graphError, setGraphError] = useState(null);

    const isPublicView = location.pathname.startsWith('/explore/');

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

        const fetchGraphData = async () => {
            try {
                const res = await apiService.getCharacterGraphs(projectId);
                setGraphData(res);
            } catch (err) {
                console.error('Failed to fetch graph data:', err);
                setGraphError(err.message);
            }
        };

        fetchGraphData();
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
                    <h1>Analytics Page</h1>
                    <p>This is the analytics page where you can view various statistics and insights.</p>
                    {graphError ? (
                        <div style={{ color: 'red' }}>
                            <p>Error loading graph: {graphError}</p>
                        </div>
                    ) : graphData && graphData.nodes && graphData.links ? (
                        <div>
                            <p>Graph loaded with {graphData.nodes?.length || 0} nodes and {graphData.links?.length || 0} links</p>
                            <CharacterGraph data={graphData} />
                        </div>
                    ) : graphData === null ? (
                        <p>Loading graph...</p>
                    ) : (
                        <div style={{ color: 'orange' }}>
                            <p>Graph data received but invalid structure:</p>
                            <pre>{JSON.stringify(graphData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;