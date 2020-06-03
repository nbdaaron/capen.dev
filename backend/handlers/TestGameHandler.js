const { inGameOnly } = require("./util");

const GAME_ID = "test";

// RECV_OPS
const TEST_GAME_CLICK_BUTTON = "TEST_GAME_CLICK_BUTTON";

const TestGameHandler = (socket, io) => {
  socket.on(
    TEST_GAME_CLICK_BUTTON,
    inGameOnly(socket, GAME_ID, function (game) {
      game.clickButton(socket.user);
    })
  );
};

module.exports = TestGameHandler;
