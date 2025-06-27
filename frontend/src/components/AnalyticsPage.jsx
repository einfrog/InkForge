import React, {useEffect, useState} from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import * as apiService from '../services/apiService';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import CharacterGraph from './CharacterGraph.jsx';
import Footer from "./Footer.jsx";

function AnalyticsPage() {
    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const {id: projectId} = useParams();
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
            <Header/>
            <div className="project-detail-main">
                <Sidebar
                    projectName={project.project_name}
                    projectId={project.project_id}
                    isPublicView={isPublicView}
                />
                <div className="project-detail-content">
                    <section className="content-section">
                        <header className="content-section__header">
                            <h2 className="content-section__title">Analytics Page</h2>
                            <div className="breadcrumb">
                                <Link to={'/projects'} className="breadcrumb-element">Projects</Link> <Link
                                to={`/projects/${projectId}`}
                                className="breadcrumb-element">{project.project_name}</Link> <span
                                className="breadcrumb-element">Analytics</span>
                            </div>
                        </header>


                        <p className="content-section__description">
                            This is the analytics page where you can view how your characters are connected to each other!
                        </p>

                        {graphError && (
                            <div className="text-red-500 mb-4">
                            <p>Error loading graph: {graphError}</p>
                            </div>
                        )}

                        {graphData && graphData.nodes && graphData.links ? (
                            <section className="content-item graph-section">
                                <p>
                                    {/*Graph loaded with {graphData.nodes.length} nodes and {graphData.links.length} links*/}
                                </p>
                                <CharacterGraph data={graphData}/>
                            </section>
                        ) : graphData === null ? (
                            <p>Loading graph...</p>
                        ) : (
                            <div className="text-yellow-600 mb-4">
                                <p>Graph data received but invalid structure:</p>
                                <pre>{JSON.stringify(graphData, null, 2)}</pre>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <Footer/>

        </div>

    );


}

export default AnalyticsPage;