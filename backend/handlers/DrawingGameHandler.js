const { inGameOnly } = require("./util");

const GAME_ID = "draw";

// RECV_OPS
const DRAWING_GAME_DRAW_LINE = "DRAWING_GAME_DRAW_LINE";
const DRAWING_GAME_MAKE_GUESS = "DRAWING_GAME_MAKE_GUESS";

const DrawingGameHandler = (socket, io) => {
  socket.on(
    DRAWING_GAME_DRAW_LINE,
    inGameOnly(socket, GAME_ID, function (game, info) {
      game.drawLine(socket.user, info);
    })
  );

  socket.on(
    DRAWING_GAME_MAKE_GUESS,
    inGameOnly(socket, GAME_ID, function (game, guess) {
      game.makeGuess(socket.user, guess);
    })
  );
};

module.exports = DrawingGameHandler;
