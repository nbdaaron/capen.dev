import React from 'react';
import { Redirect } from 'react-router-dom';

class Home extends React.Component {
  render() {
    if (!this.props.user) {
      return <Redirect to="/login" />;
    }
    return (
      <main>
        <div>
          <h1>capen.dev</h1>
          <p>Hello, {this.props.user.name}!</p>
        </div>
      </main>
    );
  }
}

export default Home;
