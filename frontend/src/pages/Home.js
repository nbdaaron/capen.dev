import React from 'react';

class Home extends React.Component {
  render() {
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
