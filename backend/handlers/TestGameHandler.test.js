const TestGameHandler = require("./TestGameHandler");
const { MockSocket, MockIO } = require("../mock/MockSocketIO");
const Guest = require("../model/Guest");
const Lobby = require("../model/Lobby");

jest.mock("../database/Game", () => ({
  recordResults: jest.fn(),
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
