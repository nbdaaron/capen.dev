import React from 'react';
import { Redirect } from 'react-router-dom';

class Home extends React.Component {
  render() {
    // Login condition
    if (true) {
      return <Redirect to="/login" />;
    }
    return (
      <main>
        <h1>capen.dev</h1>
        <p>Sample Homepage</p>
      </main>
    );
  }
}

export default Home;
