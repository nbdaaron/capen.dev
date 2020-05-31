import React from 'react';
import { Link } from 'react-router-dom';
import { getEmptyLobbyId } from '../util/server';

class CreateLobbyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyLobbyRoute: '/lobby',
      loading: true,
      error: false,
    };
    this.updateEmptyLobbyRoute = this.updateEmptyLobbyRoute.bind(this);
  }

  componentDidMount() {
    this.updateEmptyLobbyRoute();
  }

  updateEmptyLobbyRoute() {
    getEmptyLobbyId()
      .then(response =>
        this.setState({ loading: false, emptyLobbyRoute: `/lobby/${response.data}` })
      )
      .catch(err => this.setState({ loading: false, error: true }));
  }

  render() {
    if (this.state.loading || this.state.error) {
      return (
        <button className="btn btn-dark mr-3" disabled>
          Create Lobby
        </button>
      );
    }
    return (
      <Link data-testid="createLobby" to={this.state.emptyLobbyRoute}>
        <button className="btn btn-dark mr-3">Create Lobby</button>
      </Link>
    );
  }
}

export default CreateLobbyButton;
