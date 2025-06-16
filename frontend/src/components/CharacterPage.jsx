import { useEffect, useState } from "react";
import {useLocation, useParams} from "react-router-dom";
import * as apiService from "../services/apiService.js";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function CharacterPage() {
    const [project, setProject] = useState({});
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { id: projectId } = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const isPublicView = location.pathname.startsWith('/explore/');
    const isOwner = project.user_id === getCurrentUserId();
    const canEdit = isOwner && !isPublicView;

    const getCharacterDetailPath = (characterId) => {
        return isPublicView
            ? `/explore/${projectId}/characters/${characterId}`
            : `/projects/${projectId}/characters/${characterId}`;
    };

    useEffect(() => {
        const fetchProjectAndCharacters = async () => {
            try {
                const projectResponse = await apiService.getProjectById(projectId, token);
                setProject(projectResponse.project);


                const charactersResponse = await apiService.getCharactersByProjectId(projectId, token);
                console.log("Characters response:", charactersResponse);
                setCharacters(charactersResponse.characters);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProjectAndCharacters();
    }, [projectId, token]);

    function getCurrentUserId() {
        let token = localStorage.getItem('token');
        let userId;
        if (token) {
            try {
                const decoded = jwtDecode(token);
                return decoded.user_id || decoded.id || decoded.sub;
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }

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
                    <h1>Characters</h1>
                    {characters.length > 0 ? (
                        <ul className="list-group">
                            {characters.map((char) => (
                                <li key={char.character_id} className="list-group-item">
                                    <strong>{char.name}</strong> - {char.role || 'No role'}
                                    {/*TODO: later change this to description and add descs in database*/}
                                    <p>{char.biography}</p>
                                    <div>
                                        <Link
                                            to={getCharacterDetailPath(char.character_id)}
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No characters found for this project.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CharacterPage;
