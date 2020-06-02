const TestGameHandler = require("./TestGameHandler");
const { MockSocket, MockIO } = require("../mock/MockSocketIO");
const Guest = require("../model/guest");
const Lobby = require("../model/lobby");

jest.mock("../games/lobbies", () => ({
  getLobby: jest.fn(),
}));

const { getLobby } = require("../games/lobbies");

test("Should declare the winner", async () => {
  const socket = new MockSocket();
  socket.user = new Guest();
  socket.user.lobbyId = 123;
  socket.lobby = new Lobby(123, socket.user);
  socket.lobby.setInGame(true);
  socket.lobby.setGame("test");
  socket.join(123);

  getLobby.mockReturnValue(socket.lobby);

  TestGameHandler(socket, MockIO);

  socket.mockReceive("TEST_GAME_CLICK_BUTTON");

  expect(socket.lobby.getInGame()).toEqual(false);
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["DECLARE_WINNER", socket.user.toJSON()],
    [
      "LOBBY_STATE_CHANGE",
      { id: 123, users: [socket.user.toJSON()], game: "test", inGame: false },
    ],
  ]);
});
