import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserInfo } from '../util/server';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: {},
    };

    getUserInfo()
      .then(response => this.setState({ loading: false, user: response.data }))
      .catch(err => this.setState({ loading: false }));
  }

  render() {
    if (!this.state.loading && !this.state.user.id) {
      return <Redirect to="/login" />;
    }
    return (
      <main>
        <h1>capen.dev</h1>
        <p>Hello, {this.state.user.name}!</p>
      </main>
    );
  }
}

export default Home;
