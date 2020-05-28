import React from 'react';
import logo from '../logo.svg';

class Teaser extends React.Component {
  render() {
    return (
      <main>
        <h1>capen.dev - coming soon</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>Currently a work-in-progress. Please check back later for updates!</p>
      </main>
    );
  }
}

export default Teaser;
