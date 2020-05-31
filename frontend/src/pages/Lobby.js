import React from 'react';
import { Link } from 'react-router-dom';

class Lobby extends React.Component {
  componentDidMount() {
    // Begin listeners for lobby info
  }

  componentWillUnmount() {
    // End listeners for lobby info
  }

  render() {
    return (
      <main>
        <div>
          <h1>capen.dev - Lobby</h1>
          <p>Users in the lobby:</p>
          {[this.props.user].map(user => (
            <p key={user.id}>{user.name}</p>
          ))}
          <Link to="/home">
            <button className="btn btn-dark">Return Home</button>
          </Link>
        </div>
      </main>
    );
  }
}

export default Lobby;
