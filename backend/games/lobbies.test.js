const {
  getEmptyLobbyId,
  getLobby,
  joinLobby,
  leaveLobby,
} = require("./lobbies");
const Guest = require("../model/guest");
const Lobby = require("../model/lobby");

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
