import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Socials from "./components/Socials.jsx";
import Explore from "./components/Explore.jsx";
// import LoginPage from "./components/Login.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Explore />} />
                <Route path="/socials" element={<Socials />}/>
                {/*<Route path="/login" element={<LoginPage/>}/>*/}

            </Routes>
        </Router>

    )
}

export default App