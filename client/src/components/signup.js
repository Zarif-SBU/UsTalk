import { useState } from "react";
import React  from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async() => {
        console.log('email: ', email);
        console.log('username: ', username);
        console.log('name: ', name);
        console.log('password: ', password);
        try {
            let response = await axios.post('http://localhost:8000/signup', {email, username, name, password});
            if (response.status === 201) {
                console.log('Signup successful!');
                navigate('/login');
            } else {
                console.log('Signup failed:', response.data.error);
            }
        } catch (error) {
            console.error('Error: ', error.message);
        }
    }

    return(<div>
        <div id = 'login'>
            <img id="logo" alt = 'logo' src={process.env.PUBLIC_URL + '/logo.png'}/>
            <p> Sign up to see photos and videos from your friends </p>
            <p> <input className='loginTextBox' type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/> </p>
            <p> <input className='loginTextBox' type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)}/> </p>
            <p> <input className='loginTextBox' type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/> </p>
            <p> <input className='loginTextBox' type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/> </p>
            <button id = 'loginButton' onClick={handleSignUp}> Sign up </button>
        </div>
        <div id = 'notlogin'>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    </div>);
}