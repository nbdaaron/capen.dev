const { inGameOnly } = require("./util");
const { finishGame } = require("../games/lobbies");

const GAME_ID = "test";
// RECV_OPS
const TEST_GAME_CLICK_BUTTON = "TEST_GAME_CLICK_BUTTON";

const TestGameHandler = (socket, io) => {
  socket.on(
    TEST_GAME_CLICK_BUTTON,
    inGameOnly(socket, GAME_ID, function (info) {
      finishGame(io, socket.user.lobbyId, socket.user);
    })
  );
};

module.exports = TestGameHandler;
