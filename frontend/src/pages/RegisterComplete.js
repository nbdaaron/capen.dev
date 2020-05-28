import React from 'react';
import { Link } from 'react-router-dom';

class RegisterComplete extends React.Component {
  render() {
    return (
      <main>
        <h2>Registration Complete!</h2>
        <p>
          You may now log in with your credentials! <Link to="/login">Click here</Link> to
          return to the Login Page.
        </p>
      </main>
    );
  }
}

export default RegisterComplete;
