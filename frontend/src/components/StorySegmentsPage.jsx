import React, {useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import './components.css';
import Footer from "./Footer.jsx";

function SegmentsPage() {
    const {id: projectId} = useParams();
    const token = localStorage.getItem("token");
    const location = useLocation();
    const isPublicView = location.pathname.startsWith("/explore/");

    const [project, setProject] = useState({});
    const [segments, setSegments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(null); // current editing segmentId or 'new'
    const [editFields, setEditFields] = useState({title: "", content: ""});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const {project: fetchedProject} = await apiService.getProjectById(projectId, token);
                setProject(fetchedProject);

                const {segments: fetchedSegments} = await apiService.getStorySegmentsByProjectId(projectId, token);
                console.log("Fetched segments:", fetchedSegments);
                setSegments(fetchedSegments);
            } catch (err) {
                setError("Failed to load project data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [projectId, token]);

    // Start editing a new blank segment (not created on backend yet)
    const startNewSegment = () => {
        setEditMode("new");
        setEditFields({title: "", content: ""});
        setError(null);
        setSuccess(null);
    };

    // Start editing existing segment
    const startEditSegment = (segment) => {
        console.log("Starting edit for segment:", segment);
        setEditMode(segment.segment_id);
        setEditFields({title: segment.title, content: segment.content});
        setError(null);
        setSuccess(null);
    };

    const handleEditChange = (field, value) => {
        setEditFields((prev) => ({...prev, [field]: value}));
    };

    const saveSegment = async () => {
        if (editMode === "new") {
            try {
                const newSegment = await apiService.createStorySegment(projectId, editFields, token);
                console.log("Created new segment:", newSegment);

                // Fetch fresh data to ensure we have the latest state
                const {segments: updatedSegments} = await apiService.getStorySegmentsByProjectId(projectId, token);
                setSegments(updatedSegments);

                // reset editing state and show success
                setEditMode(null);
                setEditFields({title: "", content: ""});
                setSuccess("New segment created!");
                setError(null);
            } catch (err) {
                setError("Failed to create new segment.");
                setSuccess(null);
            }
        } else {
            try {
                console.log("Updating segment with ID:", editMode);
                await apiService.updateStorySegment(projectId, editMode, editFields, token);

                // Fetch fresh data to ensure we have the latest state
                const {segments: updatedSegments} = await apiService.getStorySegmentsByProjectId(projectId, token);
                setSegments(updatedSegments);

                setEditMode(null);
                setEditFields({title: "", content: ""});
                setSuccess("Segment updated!");
                setError(null);
            } catch (err) {
                setError("Failed to update segment.");
                setSuccess(null);
            }
        }
    };

    // Delete segment
    const deleteSegment = async (segmentId) => {
        try {
            await apiService.deleteStorySegment(projectId, segmentId, token);

            // Fetch fresh data to ensure we have the latest state
            const {segments: updatedSegments} = await apiService.getStorySegmentsByProjectId(projectId, token);
            setSegments(updatedSegments);

            setSuccess("Segment deleted!");
            setError(null);
            if (editMode === segmentId) setEditMode(null);
        } catch (err) {
            setError("Failed to delete segment.");
            setSuccess(null);
        }
    };

    if (isLoading) return <div className="form-container"><p>Loading...</p></div>;

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
                    <div className="content-section">
                        <div className="content-section__header">
                            <div className="title-button-container">
                            <h2 className="content-section__title">Story Segments</h2>
                            {!isPublicView && editMode !== "new" && (
                                <button onClick={startNewSegment} className="action-btn">
                                    Create Segment
                                </button>
                            )}
                            </div>
                            <div className="breadcrumb">
                                <Link to={'/projects'} className="breadcrumb-element">Projects</Link> <Link
                                to={`/projects/${projectId}`}
                                className="breadcrumb-element">{project.project_name}</Link> <span
                                className="breadcrumb-element">Story Segments</span>
                            </div>
                        </div>


                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {success && <div className="text-green-500 mb-4">{success}</div>}

                        <div className="content-grid">
                            {segments.length === 0 && editMode !== "new" ? (
                                <p>No story segments available for this project.</p>
                            ) : (
                                segments.filter(segment => segment && segment.segment_id).map((segment) => (
                                    <div key={segment.segment_id} className="content-item">
                                        {editMode === segment.segment_id ? (
                                            <div className="flex flex-col gap-4">
                                                <input
                                                    type="text"
                                                    value={editFields.title}
                                                    onChange={(e) => handleEditChange("title", e.target.value)}
                                                    className="form-input"
                                                    placeholder="Title"
                                                />
                                                <textarea
                                                    value={editFields.content}
                                                    onChange={(e) => handleEditChange("content", e.target.value)}
                                                    className="form-input form-textarea"
                                                    placeholder="Content"
                                                />
                                                <div className="flex gap-2">
                                                    <button onClick={saveSegment} className="action-btn">Save</button>
                                                    <button onClick={() => setEditMode(null)}
                                                            className="cancel-btn">Cancel
                                                    </button>
                                                    <button onClick={() => deleteSegment(segment.segment_id)}
                                                            className="alarm-btn">Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="content-item__title">{segment.title}</h3>
                                                <div className="content-item__content">
                                                    <p>{segment.content || "No content available"}</p>
                                                    {!isPublicView && (
                                                        <div className="form-buttons">
                                                            <button onClick={() => startEditSegment(segment)}
                                                                    className="action-btn">Edit
                                                            </button>
                                                            <button onClick={() => deleteSegment(segment.segment_id)}
                                                                    className="alarm-btn">Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}

                            {editMode === "new" && (
                                <div className="content-item">
                                    <div className="flex flex-col gap-4">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={editFields.title}
                                            onChange={(e) => handleEditChange("title", e.target.value)}
                                            className="form-input"
                                        />
                                        <textarea
                                            placeholder="Content"
                                            value={editFields.content}
                                            onChange={(e) => handleEditChange("content", e.target.value)}
                                            className="form-input form-textarea"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={saveSegment} className="btn btn-primary">Save New Segment
                                            </button>
                                            <button onClick={() => setEditMode(null)}
                                                    className="btn btn-secondary">Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </div>
    );
}

export default SegmentsPage;
