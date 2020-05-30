import React from 'react';
import { AUTH_TOKEN_COOKIE, logout } from '../util/server';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

class LogoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.requestLogout = this.requestLogout.bind(this);
  }

  requestLogout() {
    logout();
    Cookies.remove(AUTH_TOKEN_COOKIE);
    this.props.updateUser();
  }

  render() {
    return (
      <Link to="/logout">
        <button onClick={this.requestLogout} className="btn btn-dark">
          Log Out
        </button>
      </Link>
    );
  }
}

export default LogoutButton;
