import React from 'react';
import { joinLobby, leaveLobby } from '../server/lobby';
import BeforeGameWindow from '../lobby/BeforeGameWindow';
import Game from '../lobby/Game';
import Games from '../games/Games';
import WinnerWindow from '../lobby/WinnerWindow';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [this.props.user],
      chatMessages: [],
      inGame: false,
      game: Object.keys(Games)[0],
      winner: null,
    };
    this.updateLobbyState = this.updateLobbyState.bind(this);
    this.recvLobbyChatMessage = this.recvLobbyChatMessage.bind(this);
    this.clearWinner = this.clearWinner.bind(this);
    this.declareWinner = this.declareWinner.bind(this);
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.listeners = joinLobby(
      id,
      this.updateLobbyState,
      this.recvLobbyChatMessage,
      this.declareWinner
    );
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

  declareWinner(winner) {
    this.setState({ winner });
  }

  clearWinner() {
    this.setState({
      winner: null,
    });
  }

  render() {
    const { user } = this.props;
    const { game, chatMessages, users, inGame, winner } = this.state;

    if (inGame) {
      return <Game game={game} />;
    } else if (this.state.winner) {
      return <WinnerWindow game={game} winner={winner} return={this.clearWinner} />;
    }

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
