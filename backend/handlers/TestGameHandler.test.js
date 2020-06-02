const TestGameHandler = require("./TestGameHandler");
const { MockSocket, MockIO } = require("../mock/MockSocketIO");
const Guest = require("../model/guest");
const Lobby = require("../model/lobby");

jest.mock("../games/lobbies", () => ({
  finishGame: jest.fn(),
  getLobby: jest.fn(),
}));

const { finishGame, getLobby } = require("../games/lobbies");

test("Should call finish game", async () => {
  const socket = new MockSocket();
  socket.user = new Guest();
  socket.user.lobbyId = 123;
  socket.lobby = new Lobby(123, socket.user);
  socket.lobby.setInGame(true);
  socket.lobby.setGame("test");

  getLobby.mockReturnValue(socket.lobby);

  TestGameHandler(socket, MockIO);

  socket.mockReceive("TEST_GAME_CLICK_BUTTON");
  expect(finishGame).toHaveBeenCalledWith(MockIO, 123, socket.user);
});
