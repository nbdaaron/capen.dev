// Lobbies will be (for the most part) 13-digit numbers.
const MAX_LOBBY_ID = 1e14;

class Lobby {
  constructor(id, creator) {
    this.id = id;
    this.users = [creator];
    this.game = "test";
    this.inGame = false;
  }

  static generateRandomId() {
    return Math.floor(Math.random() * MAX_LOBBY_ID);
  }

  setGame(game) {
    this.game = game;
  }

  setInGame(val) {
    this.inGame = val;
  }

  getLeader() {
    return this.users[0];
  }

  getUsers() {
    return this.users;
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
