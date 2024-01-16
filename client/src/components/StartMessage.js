import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StartMessage() {
    const [showMenu, setShowMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleButtonClick = () => {
        setShowMenu(!showMenu);
    }

    useEffect(() => {
            const fetchData = async () => {
                if(searchTerm !== "") {
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await axios.get(`http://localhost:8000/users/${searchTerm}/limit15`);
                        setUsers(response.data);
                        if(response.data.length === 0) {
                            setError('No users found');
                        }
                    } catch (error) {
                        console.error('Error fetching users:', error.message);
                        setError('Error fetching users. Please try again.');
                    } finally {
                        setLoading(false);
                    }
                }
                else {
                    setUsers([]);
                }
            };
        fetchData();
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const makeChatroom = async(username) => {
        try {
            const response = await axios.post('http://localhost:8000/createChatroom', {username}, {withCredentials: true});
            console.log(response.data);
        } catch (error) {
            console.error('Error creating chatroom:', error.message);
        }
    }

    return (
        <div className="message-container">
            <button onClick={handleButtonClick}>Send Message</button>
            {showMenu && (
                <div className="modal">
                    <div className="popup-menu">
                        <input type="text"
                            placeholder="Search users"
                            value={searchTerm}
                            onChange={handleSearchChange}/>
                        {loading && <p>Loading...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <ul>
                            {users.map((user, index) => (
                                <li key={index} onClick={() => makeChatroom(user.username)}>{user.username}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="backdrop" onClick={handleButtonClick}></div>
                </div>
            )}
        </div>
    );
}