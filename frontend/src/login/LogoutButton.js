import React from 'react';
import { AUTH_TOKEN_COOKIE } from '../server/socket';
import { logout } from '../server/login';
import Cookies from 'js-cookie';

class LogoutButton extends React.Component {
  constructor(props) {
    super(props);
    this.requestLogout = this.requestLogout.bind(this);
  }

  requestLogout() {
    logout();
    Cookies.remove(AUTH_TOKEN_COOKIE);
    this.props.updateUser('/login');
  }

  render() {
    return (
      <button onClick={this.requestLogout} className="btn btn-dark">
        Log Out
      </button>
    );
  }
}

export default LogoutButton;
