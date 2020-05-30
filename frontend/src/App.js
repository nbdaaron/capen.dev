import React from 'react';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterComplete from './pages/RegisterComplete';
import Teaser from './pages/Teaser';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loader from './util/Loader';
import { getUserInfo } from './util/server';

const UNAUTHENTICATED_ROUTES = [
  [Login, '/login'],
  [Register, '/register'],
  [RegisterComplete, '/registerComplete'],
  [Teaser, '/'],
];

const UNAUTHENTICATED_REDIRECT = '/login';

const AUTHENTICATED_ROUTES = [
  [Home, '/home'],
  [Teaser, '/'],
];

const AUTHENTICATED_REDIRECT = '/home';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: {},
    };
  }

  componentDidMount() {
    getUserInfo()
      .then(response => this.setState({ loading: false, user: response.data }))
      .catch(err => this.setState({ loading: false }));
  }

  render() {
    let routes = UNAUTHENTICATED_ROUTES;
    let redirect = UNAUTHENTICATED_REDIRECT;
    if (this.state.user.id) {
      routes = AUTHENTICATED_ROUTES;
      redirect = AUTHENTICATED_REDIRECT;
    }
    if (this.state.loading) {
      return <Loader loading={this.state.loading} />;
    }
    // Unauthenticated endpoints
    return (
      <div className="App">
        <header className="App-header">
          <Switch>
            {routes.map(([Component, path]) => (
              <Route exact path={path} key={path}>
                <Component user={this.state.user} />
              </Route>
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
