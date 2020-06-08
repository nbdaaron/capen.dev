// SEND_OPS
const DECLARE_WINNER = "DECLARE_WINNER";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";
const { recordResults } = require("../database/Game");

class Game {
  constructor(io, lobby, gameId) {
    this.io = io;
    this.lobby = lobby;
    this.gameId = gameId;
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

    // Record game results
    recordResults(this.gameId, this.lobby.users, winner);
  }
}

module.exports = Game;
