const Game = require("../Game");

class TestGame extends Game {
  constructor(io, lobby) {
    super(io, lobby, "test");
  }

  clickButton(user) {
    this.finishGame(user);
  }
}

module.exports = TestGame;
