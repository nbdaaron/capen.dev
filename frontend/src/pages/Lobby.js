import React from 'react';
import { Link } from 'react-router-dom';
import { joinLobby, leaveLobby, sendLobbyChatMessage } from '../util/server';
import Chatbox from '../chat/Chatbox';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [this.props.user],
      chatMessages: [],
    };
    this.updateLobbyState = this.updateLobbyState.bind(this);
    this.recvLobbyChatMessage = this.recvLobbyChatMessage.bind(this);
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

  render() {
    return (
      <main>
        <div>
          <h1>capen.dev - Lobby</h1>
          <p>Users in the lobby:</p>
          {this.state.users.map(user => (
            <p key={user.id}>{user.name}</p>
          ))}
          <Chatbox
            messages={this.state.chatMessages}
            sendMessage={sendLobbyChatMessage}
          />
          <Link to="/home">
            <button className="btn btn-dark">Return Home</button>
          </Link>
        </div>
      </main>
    );
  }
}

export default Lobby;
