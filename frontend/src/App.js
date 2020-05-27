import React from 'react';
import './App.css';
import Home from './pages/Home';
import Teaser from './pages/Teaser';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/">
              <Teaser />
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
