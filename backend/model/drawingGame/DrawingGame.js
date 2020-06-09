const Game = require("../Game");

// SEND_OPS
// const DRAWING_GAME_UPDATE = "DRAWING_GAME_UPDATE";
const DRAWING_GAME_LINE_DRAWN = "DRAWING_GAME_LINE_DRAWN";

class DrawingGame extends Game {
  drawLine(user, info) {
    this.io.to(this.lobby.id).emit(DRAWING_GAME_LINE_DRAWN, info);
  }
}

module.exports = DrawingGame;
