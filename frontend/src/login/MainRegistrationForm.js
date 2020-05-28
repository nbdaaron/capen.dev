import React from 'react';

class MainRegistrationForm extends React.Component {
  render() {
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="username">Username</label>
          <input className="form-control" type="text" id="username" required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" id="password" required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="confirm">Confirm Password</label>
          <input className="form-control" type="password" id="confirm" required></input>
        </div>
        <div className="form-group row">
          <label htmlFor="email">E-mail Address</label>
          <input className="form-control" type="text" id="email" required></input>
          <small id="emailHelp" className="form-text text-muted">
            We use your e-mail ONLY to reset your password if you forget it.
          </small>
        </div>
        <div className="form-group">
          <button className="btn btn-dark mr-3">Create Account</button>
        </div>
      </form>
    );
  }
}

export default MainRegistrationForm;
