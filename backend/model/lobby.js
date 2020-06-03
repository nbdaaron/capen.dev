// Lobbies will be (for the most part) 13-digit numbers.
const MAX_LOBBY_ID = 1e14;
const BombGame = require("./bombGame/bombGame");
const TestGame = require("./testGame/testGame");

class Lobby {
  constructor(id, creator) {
    this.id = id;
    this.users = [creator];
    this.gameId = "test";
  }

  static generateRandomId() {
    return Math.floor(Math.random() * MAX_LOBBY_ID);
  }

  cleanup() {
    if (this.game) {
      this.game.finishGame();
    }
  }

  toJSON() {
    return {
      id: this.id,
      users: this.users,
      gameId: this.gameId,
      inGame: this.isInGame(),
    };
  }

  startGame(io) {
    if (this.gameId === "test") {
      this.game = new TestGame(io, this);
    } else if (this.gameId === "bomb") {
      this.game = new BombGame(io, this);
    } else {
      throw new Error(`Game ID ${this.gameId} doesn't exist.`);
    }
  }

  isInGame() {
    return this.game !== undefined;
  }

  getLeader() {
    return this.users[0];
  }

  userCount() {
    return this.users.length;
  }

  isEmpty() {
    return this.userCount() === 0;
  }

  addUser(userToAdd) {
    if (!this.users.some((user) => user.equals(userToAdd))) {
      this.users.push(userToAdd);
    }
  }

  removeUser(userToRemove) {
    const index = this.users.findIndex((user) => user.equals(userToRemove));
    if (index === -1) {
      // User isn't even in this lobby.
      return;
    }
    // Move user at last index into slot and pop.
    const lastIndex = this.users.length - 1;
    this.users[index] = this.users[lastIndex];
    this.users.pop();
  }
}

module.exports = Lobby;
