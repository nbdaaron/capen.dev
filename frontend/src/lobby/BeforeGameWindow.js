import React from 'react';
import { Link } from 'react-router-dom';
import Chatbox from '../chat/Chatbox';
import { startGame, selectGame, sendLobbyChatMessage } from '../server/lobby';
import Games from '../games/Games';
import { toPairs } from 'lodash';

class BeforeGameWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      success: '',
      error: '',
    };

    this.getLeader = this.getLeader.bind(this);
    this.copyInviteLink = this.copyInviteLink.bind(this);
  }

  getLeader() {
    return this.props.users[0];
  }

  isLeader() {
    return this.props.user.id === this.props.users[0].id;
  }

  copyInviteLink() {
    window.navigator.clipboard
      .writeText(window.location.href)
      .then(() => this.setState({ success: 'Copied Link to clipboard!', error: '' }))
      .catch(err => this.setState({ success: '', error: err.message }));
  }

  render() {
    return (
      <main>
        <h1>capen.dev - Lobby</h1>
        {this.state.success && (
          <small className="text-success mb-2">{this.state.success}</small>
        )}
        {this.state.error && <small className="text-danger">{this.state.error}</small>}
        <p className="mt-2">
          Users in the lobby: {this.props.users.map(user => user.name).join(', ')}
        </p>
        <p className="mt-2">Room Leader: {this.getLeader().name}</p>
        <label htmlFor="game" className="mr-2">
          Selected Game:
        </label>
        <select
          className="btn-dark"
          name="game"
          disabled={!this.isLeader()}
          value={this.props.gameId}
          onChange={evt => selectGame(evt.target.value)}
        >
          {toPairs(Games).map(([gameId, { title }]) => (
            <option value={gameId} key={gameId}>
              {title}
            </option>
          ))}
        </select>
        <Chatbox messages={this.props.chatMessages} sendMessage={sendLobbyChatMessage} />
        <button
          className="btn btn-dark mt-3 mr-3"
          onClick={startGame}
          disabled={!this.isLeader()}
        >
          Start Game!
        </button>
        <button className="btn btn-dark mt-3 mr-3" onClick={this.copyInviteLink}>
          Copy Invite Link
        </button>
        <Link to="/home">
          <button className="btn btn-dark mt-3">Return Home</button>
        </Link>
      </main>
    );
  }
}

export default BeforeGameWindow;
