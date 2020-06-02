import React from 'react';
import './App.css';
import './chat/Chatbox.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Register from './pages/Register';
import RegisterComplete from './pages/RegisterComplete';
import Teaser from './pages/Teaser';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loader from './shared/Loader';
import { getUserInfo } from './server/login';

const UNAUTHENTICATED_ROUTES = [
  [Login, '/login'],
  [Register, '/register'],
  [RegisterComplete, '/registerComplete'],
  [Teaser, '/'],
];

const UNAUTHENTICATED_REDIRECT = '/login';

const AUTHENTICATED_ROUTES = [
  [Home, '/home'],
  [Lobby, '/lobby/:id'],
  [Teaser, '/'],
];

const AUTHENTICATED_REDIRECT = '/home';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      error: null,
      redirect: null,
    };

    this.updateUser = this.updateUser.bind(this);
  }

  updateUser(redirect) {
    getUserInfo()
      .then(response => this.setState({ loading: false, user: response.data, redirect }))
      .catch(response => this.setState({ loading: false, error: response.error }));
  }

  componentDidMount() {
    this.updateUser();
  }

  render() {
    let routes = UNAUTHENTICATED_ROUTES;
    let redirect = UNAUTHENTICATED_REDIRECT;
    if (this.state.user) {
      routes = AUTHENTICATED_ROUTES;
      redirect = AUTHENTICATED_REDIRECT;
    }
    if (this.state.loading) {
      return <Loader loading={this.state.loading} />;
    }
    return (
      <div className="App">
        <header className="App-header">
          <Switch>
            {routes.map(([Component, path]) => (
              <Route
                exact
                path={path}
                key={path}
                render={props => (
                  <Component
                    user={this.state.user}
                    error={this.state.error}
                    updateUser={this.updateUser}
                    {...props}
                  />
                )}
              />
            ))}
            {this.state.redirect && <Redirect to={this.state.redirect} />}
            {!this.state.user &&
              AUTHENTICATED_ROUTES.map(([Component, path]) => (
                <Redirect
                  exact
                  key={`redirect_${path}`}
                  from={path}
                  to={`/login/?next=${path}`}
                />
              ))}
            <Route>
              <Redirect to={redirect} />
            </Route>
          </Switch>
        </header>
      </div>
    );
  }
}

export default App;
