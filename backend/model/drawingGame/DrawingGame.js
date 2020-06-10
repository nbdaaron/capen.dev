const Game = require("../Game");

// SEND_OPS
// const DRAWING_GAME_UPDATE = "DRAWING_GAME_UPDATE";
const DRAWING_GAME_LINE_DRAWN = "DRAWING_GAME_LINE_DRAWN";
const DRAWING_GAME_SHOW_GUESS = "DRAWING_GAME_SHOW_GUESS";

class DrawingGame extends Game {
  constructor(...data) {
    super(...data);
    this.guessId = 1;
  }

  drawLine(user, info) {
    this.io.to(this.lobby.id).emit(DRAWING_GAME_LINE_DRAWN, info);
  }

  makeGuess(user, guess) {
    // TODO: check if guess is correct.
    const nextGuess = {
      id: this.guessId,
      user: user,
      guess: guess,
    };
    this.guessId += 1;
    this.io.to(this.lobby.id).emit(DRAWING_GAME_SHOW_GUESS, nextGuess);
  }
}

module.exports = DrawingGame;
