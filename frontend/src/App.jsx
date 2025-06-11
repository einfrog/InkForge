import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Socials from "./components/Socials.jsx";
import Explore from "./components/Explore.jsx";
import LoginPage from "./components/Login.jsx";
import AdminTest from "./components/AdminTest.jsx";
import UserForm from "./components/UserForm.jsx";
import UserDetailPage from "./components/UserDetailPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Explore/>}/>
                <Route path="/socials" element={<Socials/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/admin-test" element={<AdminTest/>}/>
                {/*<Route path='/socials/new' element={<UserForm/>}></Route>*/}
                {/*<Route path='/socials/:id/edit' element={<UserForm/>}></Route>*/}
                <Route path="/register" element={<UserForm />}/>
                <Route path="/socials/:id" element={<UserDetailPage />}/>
            </Routes>
        </Router>
    )
}

export default App