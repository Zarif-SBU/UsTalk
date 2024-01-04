import React from 'react';
import axios from 'axios';
import Welcome from './components/welcome';
import Signup from './components/signup';
import Homepage from './components/HomePage';
import StartMessage from './components/StartMessage';
import './stylesheet/App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: false };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:8000/check-auth');
      console.log('Authentication Check Response:', response.data);
      this.setState({ authenticated: response.data.authenticated });
    } catch (error) {
      console.error('Error checking authentication: ', error.message);
    }
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route
            path='/'
            element={this.state.authenticated ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route path='/login' element={<Welcome />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/s' element={<StartMessage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;