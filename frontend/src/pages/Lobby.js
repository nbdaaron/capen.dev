import React from 'react';
import { Link } from 'react-router-dom';
import {
  joinLobby,
  leaveLobby,
  selectGame,
  startGame,
  sendLobbyChatMessage,
} from '../util/server';
import Chatbox from '../chat/Chatbox';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [this.props.user],
      chatMessages: [],
      inGame: false,
      game: 'test',
      success: '',
      error: '',
    };
    this.updateLobbyState = this.updateLobbyState.bind(this);
    this.recvLobbyChatMessage = this.recvLobbyChatMessage.bind(this);
    this.copyInviteLink = this.copyInviteLink.bind(this);
    this.getLeader = this.getLeader.bind(this);
    this.isLeader = this.isLeader.bind(this);
    this.selectGame = this.selectGame.bind(this);
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.listeners = joinLobby(id, this.updateLobbyState, this.recvLobbyChatMessage);
  }

  componentWillUnmount() {
    const id = this.props.match.params.id;
    leaveLobby(id, this.listeners);
    delete this.listeners;
  }

  updateLobbyState(newState) {
    this.setState(newState);
  }

  recvLobbyChatMessage(newMessage) {
    this.setState({
      chatMessages: this.state.chatMessages.concat(newMessage),
    });
  }

  copyInviteLink() {
    window.navigator.clipboard
      .writeText(window.location.href)
      .then(() => this.setState({ success: 'Copied Link to clipboard!', error: '' }))
      .catch(err => this.setState({ success: '', error: err.message }));
  }

  getLeader() {
    return this.state.users[0];
  }

  isLeader() {
    return this.props.user.id === this.getLeader().id;
  }

  selectGame(event) {
    selectGame(event.target.value);
  }

  render() {
    if (this.state.inGame) {
      return (
        <main>
          <h1>woo I'm in game!</h1>
        </main>
      );
    }
    return (
      <main>
        <h1>capen.dev - Lobby</h1>
        {this.state.success && (
          <small className="text-success mb-2">{this.state.success}</small>
        )}
        {this.state.error && <small className="text-danger">{this.state.error}</small>}
        <p className="mt-2">
          Users in the lobby: {this.state.users.map(user => user.name).join(', ')}
        </p>
        <p className="mt-2">Room Leader: {this.getLeader().name}</p>
        <label for="game" className="mr-2">
          Selected Game:
        </label>
        <select
          className="btn-dark"
          name="game"
          disabled={!this.isLeader()}
          value={this.state.game}
          onChange={this.selectGame}
        >
          <option value="test">Test Game</option>
          <option value="test2">Test Game 2</option>
          <option value="test3">Test Game 3</option>
        </select>
        <Chatbox messages={this.state.chatMessages} sendMessage={sendLobbyChatMessage} />
        <button className="btn btn-dark mt-3 mr-3" onClick={startGame}>
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

export default Lobby;
