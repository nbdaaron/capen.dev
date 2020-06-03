const {
  WIDTH_IN_BLOCKS,
  HEIGHT_IN_BLOCKS,
  OBJECTS,
  ALWAYS_EMPTY_SPACES,
  BOX_CHANCE,
  REFRESH_RATE,
} = require("./constants");
const Player = require("./player");
const Game = require("../game");
const Bomb = require("./bomb");

// SEND_OPS
const BOMB_GAME_UPDATE_BOARD = "BOMB_GAME_UPDATE_BOARD";

class BombGame extends Game {
  constructor(io, lobby) {
    super(io, lobby);
    this.players = BombGame.initializePlayers(lobby.users);
    this.board = BombGame.generateRandomBoard();
    this.lobby = lobby;
    this.bombs = [];
    this.interval = setInterval(
      () => io.to(lobby.id).emit(BOMB_GAME_UPDATE_BOARD, this),
      REFRESH_RATE
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      players: this.players,
      board: this.board,
    };
  }

  finishGame(winner) {
    super.finishGame(winner);
    clearInterval(this.interval);
    delete this.interval;
  }

  static initializePlayers(players) {
    const ret = {};
    let index = 0;
    players.forEach((player) => {
      ret[player.id] = new Player(player, index);
      index++;
    });
    return ret;
  }

  static generateRandomBoard() {
    const board = Array(WIDTH_IN_BLOCKS)
      .fill()
      .map(() => Array(HEIGHT_IN_BLOCKS).fill(0));
    const lastX = WIDTH_IN_BLOCKS - 1;
    const lastY = HEIGHT_IN_BLOCKS - 1;
    for (var x = 0; x < WIDTH_IN_BLOCKS; x++) {
      for (var y = 0; y < HEIGHT_IN_BLOCKS; y++) {
        // Fill in all edges with walls
        if (x === 0 || y === 0 || x === lastX || y === lastY) {
          board[x][y] = OBJECTS.WALL;
        }
        // Fill in wall objects within map.
        else if (x % 2 === 0 && y % 2 === 0) {
          board[x][y] = OBJECTS.WALL;
        }
        // Randomly place boxes
        else if (Math.random() < BOX_CHANCE) {
          board[x][y] = OBJECTS.BOX;
        }
      }
    }
    ALWAYS_EMPTY_SPACES.forEach(([x, y]) => {
      board[x][y] = OBJECTS.EMPTY;
    });
    return board;
  }

  static getCoordinatesForPosition(position) {
    const [x, y] = position;
    return [Math.floor((x + 49) / 100), Math.floor((y + 49) / 100)];
  }

  updatePlayer(user, player) {
    if (this.players[user.id]) {
      this.players[user.id].update(player);
    }
  }

  requestPlantBomb(user, position) {
    if (
      this.players[user.id] &&
      this.players[user.id].validatePosition(position)
    ) {
      const [x, y] = BombGame.getCoordinatesForPosition(position);
      if (
        this.board[x][y] === OBJECTS.EMPTY &&
        this.players[user.id].bombs > 0
      ) {
        this.plantBomb(user, x, y);
      }
    }
  }

  plantBomb(user, x, y) {
    this.bombs.push(new Bomb(user, x, y, this));
  }

  killPlayer(user) {
    delete this.players[user.id];
    if (Object.keys(this.players).length === 1) {
      const winnerId = Object.keys(this.players)[0];
      this.finishGame(this.lobby.users.find((user) => user.id == winnerId));
    }
  }
}

module.exports = BombGame;
