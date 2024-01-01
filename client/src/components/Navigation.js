import React, { useState } from "react";

export default function Navigation() {
    const[isExpanded, setIsExpanded] = useState(false);

    const toggleIsExpanded = () => {
        setIsExpanded(!isExpanded);
    }

    return(
        <div id = 'navigation' className={isExpanded? 'expanded': ''}>
            <button id = 'menu-btn' onClick={toggleIsExpanded}>
                 ☰ 
            </button>
            <ul>
                <li> Home </li>
                <li> Chats </li>
                <li> search </li>
            </ul>
        </div>
    )
}