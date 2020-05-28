import React from 'react';
import { registerAccount } from '../util/server';
import Loader from '../util/Loader';

class MainRegistrationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm: '',
      email: '',
      error: '',
      loading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegisterResponse = this.handleRegisterResponse.bind(this);
    this.handleRegisterError = this.handleRegisterError.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, password, confirm, email, loading } = this.state;

    if (loading) {
      return;
    }

    if (password !== confirm) {
      this.setState({
        error: 'Your passwords must match!'
      });
      return;
    }

    if (username.length < 5) {
      this.setState({
        error: 'Your username must be atleast 5 characters'
      });
      return;
    }

    if (password.length < 5) {
      this.setState({
        error: 'Your password must be atleast 5 characters'
      });
      return;
    }

    this.setState({
      error: '',
      loading: true
    });

    registerAccount(username, password, email)
      .then(this.handleRegisterResponse)
      .catch(this.handleRegisterError);
  }

  handleRegisterResponse(response) {
    this.setState({
      loading: false
    });
    console.log(response);
  }

  handleRegisterError(error) {
    this.setState({
      error: error.message,
      loading: false
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.state.error && (
          <small class="text-danger">
            {this.state.error}
          </small>
        )}
        <Loader loading={this.state.loading} />
        <div className="form-group row">
          <label htmlFor="username">Username</label>
          <input className="form-control" type="text" name="username" id="username" value={this.state.username} onChange={this.handleChange} required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="confirm">Confirm Password</label>
          <input className="form-control" type="password" name="confirm" id="confirm" value={this.state.confirm} onChange={this.handleChange} required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="email">E-mail Address</label>
          <input className="form-control" type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} required></input>
          <small id="emailHelp" className="form-text text-muted">
            We use your e-mail ONLY to reset your password if you forget it.
          </small>
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-dark mr-3" value="Create Account" />
        </div>
      </form>
    );
  }
}

export default MainRegistrationForm;
