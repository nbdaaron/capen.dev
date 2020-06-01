import React from 'react';
import { joinLobby, leaveLobby } from '../util/server';
import BeforeGameWindow from '../lobby/BeforeGameWindow';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [this.props.user],
      chatMessages: [],
      inGame: false,
      game: 'test',
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
    if (this.state.inGame) {
      return (
        <main>
          <h1>woo I'm in game!</h1>
        </main>
      );
    }

    const { user } = this.props;
    const { game, chatMessages, users } = this.state;

    return (
      <BeforeGameWindow
        user={user}
        users={users}
        game={game}
        chatMessages={chatMessages}
      />
    );
  }
}

export default Lobby;
