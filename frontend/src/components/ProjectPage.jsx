import React, {useState} from 'react';
import Header from './Header';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);

    return (
        <>
            <Header/>

            <div >
                <h2 >Your Projects</h2>
            </div>
        </>
    );
}

export default ProjectPage;