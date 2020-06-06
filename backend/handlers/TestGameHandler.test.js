const TestGameHandler = require("./TestGameHandler");
const { MockSocket, MockIO } = require("../mock/MockSocketIO");
const Guest = require("../model/guest");
const Lobby = require("../model/lobby");

jest.mock("../database", () => ({
  query: (query, data, cb) => {
    if (cb) {
      cb(null, [null, [{ id: 123 }]]);
    }
  },
}));

test("Should declare the winner", async () => {
  const socket = new MockSocket();
  socket.user = new Guest();
  socket.user.lobbyId = 123;
  socket.user.lobby = new Lobby(123, socket.user);
  socket.user.lobby.gameId = "test";
  socket.user.lobby.startGame(MockIO);
  socket.join(123);

  TestGameHandler(socket, MockIO);

  socket.mockReceive("TEST_GAME_CLICK_BUTTON");

  expect(socket.user.lobby.isInGame()).toEqual(false);
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["DECLARE_WINNER", socket.user.toJSON()],
    [
      "LOBBY_STATE_CHANGE",
      { id: 123, users: [socket.user.toJSON()], gameId: "test", inGame: false },
    ],
  ]);
});
