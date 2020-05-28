import React from 'react';
import { Link } from 'react-router-dom';

class MainLoginForm extends React.Component {
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
        <div className="form-group">
          <button className="btn btn-dark mr-3">Login</button>
          <Link to="/register" data-testid="register">
            <button className="btn btn-dark mr-3">Register</button>
          </Link>
          <button className="btn btn-dark">Play as Guest</button>
        </div>
      </form>
    );
  }
}

export default MainLoginForm;