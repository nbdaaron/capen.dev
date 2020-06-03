// SEND_OPS
const DECLARE_WINNER = "DECLARE_WINNER";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";

class Game {
  constructor(io, lobby) {
    this.io = io;
    this.lobby = lobby;
  }

  toJSON() {
    return {
      lobbyId: this.lobby.id,
    };
  }

  finishGame(winner) {
    delete this.lobby.game;
    this.io.to(this.lobby.id).emit(DECLARE_WINNER, winner);
    this.io.to(this.lobby.id).emit(LOBBY_STATE_CHANGE, this.lobby);
  }
}

module.exports = Game;
