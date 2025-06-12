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
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <ProjectPage/>
                    </ProtectedRoute>
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