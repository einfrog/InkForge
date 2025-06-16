import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Socials from "./components/Socials.jsx";
import Explore from "./components/Explore.jsx";
import LoginPage from "./components/Login.jsx";
import AdminTest from "./components/AdminTest.jsx";
import UserForm from "./components/UserForm.jsx";
import UserDetailPage from "./components/UserDetailPage.jsx";
import Profile from "./components/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProjectPage from "./components/ProjectPage.jsx";
import ProjectDetailPage from "./components/ProjectDetailPage.jsx";
import CharacterPage from "./components/CharacterPage.jsx";
import WorldbuildingPage from "./components/WorldbuildingPage.jsx";
import SegmentsPage from "./components/StorySegmentsPage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import CharacterDetailPage from "./components/CharacterDetailPage.jsx";
import ProjectForm from "./components/ProjectForm.jsx";
import CharacterForm from "./components/CharacterForm.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Explore/>}/>
                <Route path="/socials" element={
                    <ProtectedRoute>
                        <Socials/>
                    </ProtectedRoute>
                }/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/admin-test" element={<AdminTest/>}/>
                {/*<Route path='/socials/new' element={<UserForm/>}></Route>*/}
                <Route path="/register" element={<UserForm/>}/>
                <Route path="/socials/:id" element={
                    <ProtectedRoute>
                        <UserDetailPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/socials/:id/edit" element={
                    <ProtectedRoute>
                        <UserForm/>
                    </ProtectedRoute>
                }/>
                {/* Private Project Routes */}
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <ProjectPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id" element={
                    <ProtectedRoute>
                        <ProjectDetailPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/characters" element={
                    <ProtectedRoute>
                        <CharacterPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/characters/:characterId" element={
                    <ProtectedRoute>
                        <CharacterDetailPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/characters/new" element={
                    <ProtectedRoute>
                        <CharacterForm/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/characters/:characterId/edit" element={
                    <ProtectedRoute>
                        <CharacterForm/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/worldbuilding" element={
                    <ProtectedRoute>
                        <WorldbuildingPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/segments" element={
                    <ProtectedRoute>
                        <SegmentsPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/analytics" element={
                    <ProtectedRoute>
                        <AnalyticsPage/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects-new" element={
                    <ProtectedRoute>
                        <ProjectForm/>
                    </ProtectedRoute>
                }/>
                <Route path="/projects/:id/edit" element={
                    <ProtectedRoute>
                        <ProjectForm/>
                    </ProtectedRoute>
                }/>

                {/* Public Project Routes (Explore) */}
                <Route path="/explore/:id" element={
                    <ProjectDetailPage/>
                }/>
                <Route path="/explore/:id/characters" element={
                    <CharacterPage/>
                }/>
                <Route path="/explore/:id/characters/:characterId" element={
                    <CharacterDetailPage/>
                }/>
                <Route path="/explore/:id/worldbuilding" element={
                    <WorldbuildingPage/>
                }/>
                <Route path="/explore/:id/segments" element={
                    <SegmentsPage/>
                }/>
                <Route path="/explore/:id/analytics" element={
                    <AnalyticsPage/>
                }/>

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile/>
                    </ProtectedRoute>
                }/>
            </Routes>
        </Router>
    )
}

export default App