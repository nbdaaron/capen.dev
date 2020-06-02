const {
  getEmptyLobbyId,
  getLobby,
  joinLobby,
  leaveLobby,
  finishGame,
} = require("./lobbies");
const Guest = require("../model/guest");
const Lobby = require("../model/lobby");

const { MockSocket, MockIO } = require("../mock/MockSocketIO");

const bob = new Guest();

test("empty lobby ID generation should be unique", () => {
  expect(getEmptyLobbyId()).not.toEqual(getEmptyLobbyId());
});

test("Empty Lobbies should return undefined from getLobby", () => {
  expect(getLobby(123)).toBeUndefined();
});

test("Lobbies that exist should be properly returned", () => {
  joinLobby(123, bob);
  expect(getLobby(123)).toBeInstanceOf(Lobby);
});

test("User cannot join the same lobby twice", () => {
  joinLobby(123, bob);
  joinLobby(123, bob);
  expect(getLobby(123).userCount()).toEqual(1);
});

test("Empty lobbies should automatically be deleted", () => {
  joinLobby(123, bob);
  leaveLobby(123, bob);
  expect(getLobby(123)).toBeUndefined();
});

test("Leaving a lobby twice does nothing the second time", () => {
  joinLobby(123, bob);
  leaveLobby(123, bob);
  leaveLobby(123, bob);
  expect(getLobby(123)).toBeUndefined();
});

test("Leaving a lobby that does not exist should do nothing", () => {
  leaveLobby(123, bob);
  expect(getLobby(123)).toBeUndefined();
});

test("finishGame should exit the game and notify players of winner", () => {
  const socket = new MockSocket(bob);
  socket.join(123);
  joinLobby(123, bob);
  getLobby(123).setGame("hello123");
  getLobby(123).setInGame(true);
  finishGame(MockIO, 123, bob);

  expect(getLobby(123).getInGame()).toEqual(false);
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["DECLARE_WINNER", bob.toJSON()],
    [
      "LOBBY_STATE_CHANGE",
      { id: 123, users: [bob.toJSON()], game: "hello123", inGame: false },
    ],
  ]);
});
