const Game = require("../game");

class TestGame extends Game {
  clickButton(user) {
    this.finishGame(user);
  }
}

module.exports = TestGame;
