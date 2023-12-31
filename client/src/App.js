import welcome from './components/welcome';
import signup from './components/signup';
import './stylesheet/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          {welcome()}
          {signup()}
      </header>
    </div>
  );
}

export default App;