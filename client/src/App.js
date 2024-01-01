import React from 'react';
import Welcome from './components/welcome'; // Make sure the component name is correctly imported
import Signup from './components/signup';
import Homepage from './components/HomePage';
import './stylesheet/App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Welcome />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </Router>
    );
    }
}

export default App;