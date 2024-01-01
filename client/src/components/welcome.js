import React, { useState } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {
        try {
            console.log('Username:', username);
            console.log('Password:', password);
            let response = await axios.post('http://localhost:8000/login', { username, password });
            if(response.status === 401) {
                console.log('Invalid Credentials: ', response.data.error);
            }
        } catch (error) {
            console.error('Error: ', error.message);
        }
    };

    return (
        <div>
            <div id='login'>
                <img id='logo' alt='logo' src={process.env.PUBLIC_URL + '/logo.png'}></img>
                <p><input className='loginTextBox' type='text' placeholder='Username or email' onChange={(e) => setUsername(e.target.value)} /></p>
                <p><input className='loginTextBox' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} /></p>
                <button id='loginButton' onClick={handleLogin}>Log in</button>
                <p>_________________________________</p>
                <p> Forgot password? </p>
            </div>
            <div id='notlogin'>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    );
}