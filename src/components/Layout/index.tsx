import React, { useEffect, useState, lazy } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";
import Home from '../../views/Home'
import Game from '../../views/Game'


import PageHeader from '../Header'



const Layouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const click = (e: any) => {
        navigate(e.key)
    }
    const location = useLocation();
    return (
        <div>
            <div className='view-bg' style={{ backgroundImage: `url(/img/1.webp)`}}></div>
            <PageHeader />
            <Routes>

                <Route path="/" element={<Home></Home>} />
                <Route path="/game" element={<Game></Game>} />
            </Routes>
        </div>


    );
}

export default Layouts;
