import React from 'react';
import MainLoginForm from '../login/MainLoginForm';

class Login extends React.Component {
  render() {
    return (
      <main>
        <h1>capen.dev</h1>
        <p>Play multiplayer games online with your friends!</p>
        <MainLoginForm />
      </main>
    );
  }
}

export default Login;
