import React from 'react';
import Welcome from './components/welcome'; // Make sure the component name is correctly imported
import Signup from './components/signup';
import Navigation from './components/Navigation';
import './stylesheet/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/navigation' element={<Navigation />} />
      </Routes>
    </Router>
  );
}

export default App;