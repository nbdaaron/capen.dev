import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Home />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Currently a work-in-progress. Please check back later for updates!
        </p>
      </header>
    </div>
  );
}

export default App;
