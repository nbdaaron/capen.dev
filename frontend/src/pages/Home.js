import React from 'react';
import { Redirect } from 'react-router-dom';
import { getUserInfo } from '../util/server';
import Loader from '../util/Loader';

class Home extends React.Component {
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
    if (!this.state.loading && !this.state.user.id) {
      return <Redirect to="/login" />;
    }
    return (
      <main>
        <Loader loading={this.state.loading} />
        {!this.state.loading && (
          <div>
            <h1>capen.dev</h1>
            <p>Hello, {this.state.user.name}!</p>
          </div>
        )}
      </main>
    );
  }
}

export default Home;
