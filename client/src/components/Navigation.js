import axios from "axios";
import React, { useState } from "react";

export default function Navigation() {
    const[isExpanded, setIsExpanded] = useState(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    const logout = () => {
        axios.post('http://localhost:8000/logout');
    }

    return(
        <div id = 'navigation' className={isExpanded? 'expanded': ''}>
            {/* <button id = 'menu-btn' onClick={toggleIsExpanded}>
                 ☰ 
            </button> */}
            <ul>
                <li> <img src={process.env.PUBLIC_URL + '/home_Icon.png'}/> </li>
                <li> Chats </li>
                <li> search </li>
                <li onClick={logout}> logout </li>
            </ul>
        </div>
    )
}