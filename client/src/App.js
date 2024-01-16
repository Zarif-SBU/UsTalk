import React from 'react';
import axios from 'axios';
import Welcome from './components/welcome';
import Signup from './components/signup';
import Homepage from './components/HomePage';
import StartMessage from './components/StartMessage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './stylesheet/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: false, loading: true };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:8000/check-auth', { withCredentials: true });
      console.log('Authentication Check Response:', response.data);
      this.setState({ authenticated: response.data.authenticated, loading: false });
    } catch (error) {
      console.error('Error checking authentication: ', error.message);
      this.setState({ loading: false });
    }
  }

  render() {
    const { authenticated, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Router>
        <Routes>
          <Route
            path='/'
            element={authenticated ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path='/login'
            element={authenticated ? <Navigate to="/" /> : <Welcome />}
          />
          <Route path='/signup' element={<Signup />} />
          <Route path='/s' element={<StartMessage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;


// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { authenticated: false, loading: true };
//   }

//   async componentDidMount() {
//     try {
//       const response = await axios.get('http://localhost:8000/check-auth');
//       console.log('Authentication Check Response:', response.data);
//       this.setState({ authenticated: response.data.authenticated, loading: false });
//     } catch (error) {
//       console.error('Error checking authentication: ', error.message);
//       this.setState({ loading: false });
//     }
//   }

//   render() {
//     const { authenticated, loading } = this.state;

//     // Display a loading indicator while checking authentication
//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     return (
//       <Router>
//         <Routes>
//           <Route
//             path='/'
//             element={authenticated ? <Homepage /> : <Navigate to="/login" />}
//           />
//           <Route path='/login' element={<Welcome />} />
//           <Route path='/signup' element={<Signup />} />
//           <Route path='/s' element={<StartMessage />} />
//         </Routes>
//       </Router>
//     );
//   }
// }