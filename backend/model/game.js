// SEND_OPS
const DECLARE_WINNER = "DECLARE_WINNER";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";
const database = require("../database");

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
    database.query(
      "INSERT INTO Games SET ?; SELECT LAST_INSERT_ID() as id;",
      { gameId: this.gameId, winner: winner.id },
      (err, results, fields) => {
        const id = results[1][0].id;
        this.lobby.users.forEach((user) => {
          database.query("INSERT INTO Players SET ?", {
            gameId: id,
            userId: user.id,
          });
        });
      }
    );
  }
}

module.exports = Game;
