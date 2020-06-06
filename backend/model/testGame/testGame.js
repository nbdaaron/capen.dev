const Game = require("../game");

class TestGame extends Game {
  constructor(io, lobby) {
    super(io, lobby, "test");
  }

  clickButton(user) {
    this.finishGame(user);
  }
}

module.exports = TestGame;
