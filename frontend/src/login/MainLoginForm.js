import React from 'react';

class MainLoginForm extends React.Component {
  render() {
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="username">Username</label>
          <input className="form-control" type="text" id="username"></input>
        </div>
        <div className="form-group row">
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" id="password"></input>
        </div>
        <div className="form-group">
          <button className="btn btn-dark mr-3">Login</button>
          <button className="btn btn-dark mr-3">Register</button>
          <button className="btn btn-dark">Play as Guest</button>
        </div>
      </form>
    );
  }
}

export default MainLoginForm;