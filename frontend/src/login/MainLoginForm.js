import React from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN_COOKIE } from '../server/socket';
import { tryLogin, loginAsGuest } from '../server/login';
import Loader from '../shared/Loader';
import Cookies from 'js-cookie';

class MainLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: this.props.error,
      loading: false,
      complete: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoginAsGuest = this.handleLoginAsGuest.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleLoginFail = this.handleLoginFail.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, password, loading } = this.state;

    if (loading) {
      return;
    }

    this.setState({
      error: '',
      loading: true,
    });

    tryLogin(username, password)
      .then(this.handleLoginSuccess)
      .catch(this.handleLoginFail);
  }

  handleLoginAsGuest() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      error: '',
      loading: true,
    });

    loginAsGuest().then(this.handleLoginSuccess).catch(this.handleLoginFail);
  }

  handleLoginSuccess(response) {
    // Remember user for future logins.
    Cookies.set(AUTH_TOKEN_COOKIE, response.data.authToken);
    const redirect = new URLSearchParams(window.location.search).get('next');

    this.props.updateUser(redirect);

    this.setState({
      complete: true,
      loading: false,
    });
  }

  handleLoginFail(response) {
    this.setState({
      error: response.error,
      loading: false,
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.error && <small className="text-danger">{this.state.error}</small>}
        <Loader loading={this.state.loading} />
        <div className="form-group row mt-2">
          <label htmlFor="username">Username</label>
          <input
            className="form-control"
            type="text"
            id="username"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            required
          ></input>
        </div>
        <div className="form-group row">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            required
          ></input>
        </div>
        <div className="form-group">
          <input
            data-testid="login"
            type="submit"
            className="btn btn-dark mr-3"
            value="Login"
          ></input>
          <Link to="/register" data-testid="register">
            <button className="btn btn-dark mr-3">Register</button>
          </Link>
          <button
            data-testid="loginGuest"
            onClick={this.handleLoginAsGuest}
            className="btn btn-dark"
          >
            Play as Guest
          </button>
        </div>
      </form>
    );
  }
}

export default MainLoginForm;
