import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheet/index.css';
import App from './App';
// import axios from 'axios';

// const welcome = axios.get("http://localhost:8000/welcome");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
