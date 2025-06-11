import React, {useState} from 'react';
import Header from './Header';

const Explore = () => {
    const [projects, setProjects] = useState([]);

    return (
        <>
            <Header/>

            <div >
                <h2 >Explore Projects</h2>
            </div>
        </>
    );
}

export default Explore;