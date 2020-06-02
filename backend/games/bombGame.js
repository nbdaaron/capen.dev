const games = {};

// KEEP IN SYNC WITH frontend/src/games/BombGame
const WIDTH_IN_BLOCKS = 19;
const HEIGHT_IN_BLOCKS = 19;

const OBJECTS = {
  EMPTY: 0, // Nothing on space
  WALL: 1, // Unbreakable wall
  BOX: 2, // Breakable wall (with bombs)
  BOMB: 3, // Bomb
  EXTRA_BOMB_POWERUP: 11, // +1 Bomb Powerup
  EXTRA_POWER_POWERUP: 12, // +1 Explosion Radius Powerup
  EXTRA_SPEED_POWERUP: 13, // +1 Movement Speed Powerup
  EXPLOSION_PARTICLE: 99, // Explosion Particle
};

const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// Spaces that are always empty.
// We keep these empty so players
// can spawn there.
const ALWAYS_EMPTY_SPACES = [
  // Empty spaces for player 1
  [1, 1],
  [1, 2],
  [2, 1],
  // Empty spaces for player 2
  [WIDTH_IN_BLOCKS - 2, HEIGHT_IN_BLOCKS - 2],
  [WIDTH_IN_BLOCKS - 3, HEIGHT_IN_BLOCKS - 2],
  [WIDTH_IN_BLOCKS - 2, HEIGHT_IN_BLOCKS - 3],
  // Empty spaces for player 3
  [1, HEIGHT_IN_BLOCKS - 2],
  [2, HEIGHT_IN_BLOCKS - 2],
  [1, HEIGHT_IN_BLOCKS - 3],
  // Empty spaces for player 4
  [WIDTH_IN_BLOCKS - 2, 1],
  [WIDTH_IN_BLOCKS - 3, 1],
  [WIDTH_IN_BLOCKS - 2, 2],
];

// Chance of a blank space becoming a box
const BOX_CHANCE = 0.5;

// Update clients with my state every 300ms.
const REFRESH_RATE = 300;

class BombGame {
  constructor(io, lobby) {
    this.users = lobby.users;
    this.players = BombGame.initializePlayers(lobby.users);
    this.board = BombGame.generateRandomBoard();
    this.interval = setInterval(
      () => io.to(lobby.id).emit("BOMB_GAME_UPDATE_BOARD", this),
      REFRESH_RATE
    );
    // auto end game
    setTimeout(() => finishGame(io, lobby, lobby.users[0]), 10000);
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

  updatePlayer(user, player) {
    if (this.players[user.id]) {
      this.players[user.id].update(player);
    }
  }
}

class Player {
  constructor(user, index) {
    this.position = Player.getStartingPosition(index);
    this.direction = Player.getStartingDirection(index);
    this.moving = false;
    this.speed = 0.2;
    this.bombs = 1;
    this.power = 1;
  }

  static getStartingPosition(index) {
    if (index === 0) {
      return [100, 100];
    } else if (index === 1) {
      return [WIDTH_IN_BLOCKS * 100 - 200, HEIGHT_IN_BLOCKS * 100 - 200];
    } else if (index === 2) {
      return [100, HEIGHT_IN_BLOCKS * 100 - 200];
    } else if (index === 3) {
      return [WIDTH_IN_BLOCKS * 100 - 200, 100];
    } else {
      throw new Error("Bomb Game doesn't support more than 4 players!");
    }
  }

  static getStartingDirection(index) {
    if (index === 0) {
      return KEY.RIGHT;
    } else if (index === 1) {
      return KEY.LEFT;
    } else if (index === 2) {
      return KEY.UP;
    } else if (index === 3) {
      return KEY.DOWN;
    } else {
      throw new Error("Bomb Game doesn't support more than 4 players!");
    }
  }

  update(newPlayer) {
    // Validate position
    const leeway = 200;
    const deltaTime = Date.now() - this.lastUpdateTime;
    const radius = deltaTime * newPlayer.speed + leeway;

    const [oldX, oldY] = this.position;
    const [newX, newY] = newPlayer.position;

    if (newX - oldX > radius || newY - oldY > radius) {
      // Hacking/cheating attempt??? Ignore this packet for now.
      return;
    }

    this.position = newPlayer.position;
    this.direction = newPlayer.direction;
    this.moving = newPlayer.moving;
  }
}

function startGame(io, lobby) {
  games[lobby.id] = new BombGame(io, lobby);
}

function finishGame(io, lobby, winner) {
  lobby.setInGame(false);
  clearInterval(games[lobby.id].interval);
  io.to(lobby.id).emit("DECLARE_WINNER", winner);
  io.to(lobby.id).emit("LOBBY_STATE_CHANGE", lobby);
}

function getGame(lobbyId) {
  return games[lobbyId];
}

module.exports = { startGame, getGame };
