import React from 'react';
import CreateLobbyButton from '../lobby/CreateLobbyButton';
import LogoutButton from '../login/LogoutButton';

class Home extends React.Component {
  render() {
    return (
      <main>
        <div>
          <h1>capen.dev</h1>
          <p>Hello, {this.props.user.name}!</p>
          <CreateLobbyButton />
          <LogoutButton updateUser={this.props.updateUser} />
        </div>
      </main>
    );
  }
}

export default Home;
