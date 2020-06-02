const { inGameOnly } = require("./util");
const { getLobby } = require("../games/lobbies");

const GAME_ID = "test";

// RECV_OPS
const TEST_GAME_CLICK_BUTTON = "TEST_GAME_CLICK_BUTTON";

// SEND_OPS
const DECLARE_WINNER = "DECLARE_WINNER";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";

const TestGameHandler = (socket, io) => {
  socket.on(
    TEST_GAME_CLICK_BUTTON,
    inGameOnly(socket, GAME_ID, function (info) {
      const lobbyId = socket.user.lobbyId;
      const lobby = getLobby(lobbyId);
      lobby.setInGame(false);
      io.to(lobbyId).emit(DECLARE_WINNER, socket.user);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
    })
  );
};

module.exports = TestGameHandler;
