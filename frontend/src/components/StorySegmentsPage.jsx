import {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function SegmentsPage() {
    const [project, setProject] = useState({});
    const [segments, setSegments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const token = localStorage.getItem('token');
    const location = useLocation();

    const isPublicView = location.pathname.startsWith('/explore/');

    useEffect(() => {
        const fetchProjectAndSegements = async () => {
            try {
                const response = await apiService.getProjectById(projectId, token);
                setProject(response.project);

                const segmentsResponse = await apiService.getStorySegmentsByProjectId(projectId, token);
                console.log("Segments response:", segmentsResponse);
                setSegments(segmentsResponse.segments);
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjectAndSegements();
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
                    <h1>Story Segments Page</h1>
                    <p>This is the story segments page.</p>
                    { segments.length > 0 ? (
                        <ul>
                            {segments.map(segment => (
                                <li key={segment.segment_id}>
                                    <h2>{segment.title}</h2>
                                    <p><strong>Content:</strong> {segment.content || 'No content available'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No story segments available for this project.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SegmentsPage;