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
      success: '',
      error: '',
    };
    this.updateLobbyState = this.updateLobbyState.bind(this);
    this.recvLobbyChatMessage = this.recvLobbyChatMessage.bind(this);
    this.copyInviteLink = this.copyInviteLink.bind(this);
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

  render() {
    return (
      <main>
        <div>
          <h1>capen.dev - Lobby</h1>
          {this.state.success && (
            <small className="text-success mb-2">{this.state.success}</small>
          )}
          {this.state.error && <small className="text-danger">{this.state.error}</small>}
          <p className="mt-2">
            Users in the lobby: {this.state.users.map(user => user.name).join(', ')}
          </p>
          <Chatbox
            messages={this.state.chatMessages}
            sendMessage={sendLobbyChatMessage}
          />
          <button className="btn btn-dark mt-3 mr-3" onClick={this.copyInviteLink}>
            Copy Invite Link
          </button>
          <Link to="/home">
            <button className="btn btn-dark mt-3">Return Home</button>
          </Link>
        </div>
      </main>
    );
  }
}

export default Lobby;
