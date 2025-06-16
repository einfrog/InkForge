import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function SegmentsPage() {
    const { id: projectId } = useParams();
    const token = localStorage.getItem("token");
    const location = useLocation();
    const isPublicView = location.pathname.startsWith("/explore/");

    const [project, setProject] = useState({});
    const [segments, setSegments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(null); // current editing segmentId or 'new'
    const [editFields, setEditFields] = useState({ title: "", content: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const { project: fetchedProject } = await apiService.getProjectById(projectId, token);
                setProject(fetchedProject);

                const { segments: fetchedSegments } = await apiService.getStorySegmentsByProjectId(projectId, token);
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
        setEditFields({ title: "", content: "" });
        setError(null);
        setSuccess(null);
    };

    // Start editing existing segment
    const startEditSegment = (segment) => {
        setEditMode(segment.segment_id);
        setEditFields({ title: segment.title, content: segment.content });
        setError(null);
        setSuccess(null);
    };

    const handleEditChange = (field, value) => {
        setEditFields((prev) => ({ ...prev, [field]: value }));
    };

    const saveSegment = async () => {
        if (editMode === "new") {
            try {
                const newSegment = await apiService.createStorySegment(projectId, editFields, token);

                setSegments((prevSegments) => [...prevSegments, newSegment]);

                // reset editing state and show success
                setEditMode(null);
                setEditFields({title: "", content: ""});
                setSuccess("New segment created!");
                setError(null);
                console.log("New segment added:", newSegment, newSegment.id);
                console.log("Segments now:", [...segments, newSegment]);
            } catch (err) {
                setError("Failed to create new segment.");
                setSuccess(null);
            }
        } else {
            try {
                console.log("editMode at saveSegment:", editMode);

                await apiService.updateStorySegment(projectId, editMode, editFields, token);
                setSegments(prevSegments =>
                    prevSegments.map(seg =>
                        seg.segment_id === editMode
                            ? {...seg, ...editFields}
                            : seg
                    )
                );

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
            setSegments((prev) => prev.filter((seg) => seg.segment_id !== segmentId));
            setSuccess("Segment deleted!");
            setError(null);
            if (editMode === segmentId) setEditMode(null);
        } catch (err) {
            setError("Failed to delete segment.");
            setSuccess(null);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="project-detail-root">
            <Header />
            <div className="project-detail-main d-flex flex-row">
                <Sidebar projectName={project.project_name} projectId={project.project_id} isPublicView={isPublicView} />
                <main className="flex-grow-1 p-4">
                    <h1>Story Segments</h1>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    {success && <div style={{ color: "green" }}>{success}</div>}

                    {segments.length === 0 && editMode !== "new" ? (
                        <p>No story segments available for this project.</p>
                    ) : (
                        <ul>
                            {segments.map(({ segment_id, title, content }) => (
                                <li key={segment_id}>
                                    {editMode === segment_id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editFields.title}
                                                onChange={(e) => handleEditChange("title", e.target.value)}
                                                style={{ width: "60%" }}
                                            />
                                            <br />
                                            <textarea
                                                value={editFields.content}
                                                onChange={(e) => handleEditChange("content", e.target.value)}
                                                style={{ width: "60%", minHeight: 60 }}
                                            />
                                            <br />
                                            <button onClick={saveSegment} style={{ marginRight: 8 }}>
                                                Save
                                            </button>
                                            <button onClick={() => setEditMode(null)}>Cancel</button>
                                            <button onClick={() => deleteSegment(segment_id)} style={{ marginLeft: 8, color: "red" }}>
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2>{title}</h2>
                                            <p><strong>Content:</strong> {content || "No content available"}</p>
                                            {!isPublicView && (
                                                <button onClick={() => startEditSegment({ segment_id, title, content })}>
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}

                            {/* Render new segment editor inline */}
                            {editMode === "new" && (
                                <li key="new-segment" style={{ backgroundColor: "#eef", padding: 10 }}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={editFields.title}
                                        onChange={(e) => handleEditChange("title", e.target.value)}
                                        style={{ width: "60%" }}
                                    />
                                    <br />
                                    <textarea
                                        placeholder="Content"
                                        value={editFields.content}
                                        onChange={(e) => handleEditChange("content", e.target.value)}
                                        style={{ width: "60%", minHeight: 60 }}
                                    />
                                    <br />
                                    <button onClick={saveSegment} style={{ marginRight: 8 }}>
                                        Save New Segment
                                    </button>
                                    <button onClick={() => setEditMode(null)}>Cancel</button>
                                </li>
                            )}
                        </ul>
                    )}

                    {!isPublicView && editMode !== "new" && (
                        <button onClick={startNewSegment} style={{ marginTop: 20 }}>
                            Create Segment
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SegmentsPage;
