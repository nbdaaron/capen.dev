const LobbyHandler = require("./LobbyHandler");
const { MockSocket, MockIO } = require("../mock/MockSocketIO");
const User = require("../model/User");
const { Anything } = require("../testingUtil");

jest.mock("../database/Game", () => ({
  recordResults: jest.fn(),
}));

test("Should generate empty lobby IDs on request", () => {
  const socket = new MockSocket(true);
  LobbyHandler(socket, MockIO);
  socket.mockReceive("GET_EMPTY_LOBBY_ID");
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["EMPTY_LOBBY_ID_RESPONSE", Anything],
  ]);
});

test("Should notify all members when someone joins/leaves lobby", () => {
  const bob = new User(1, "Bob");
  const george = new User(2, "George");

  const socket1 = new MockSocket(bob);
  const socket2 = new MockSocket(george);

  LobbyHandler(socket1, MockIO);
  LobbyHandler(socket2, MockIO);

  socket1.mockReceive("JOIN_LOBBY", 333);
  socket2.mockReceive("JOIN_LOBBY", 333);
  socket2.mockReceive("LEAVE_LOBBY");

  const remainingLobbyData = {
    id: 333,
    gameId: "test",
    inGame: false,
  };

  const expectedResult = [
    ["LOBBY_STATE_CHANGE", { users: [bob.toJSON()], ...remainingLobbyData }],
    [
      "LOBBY_STATE_CHANGE",
      { users: [bob.toJSON(), george.toJSON()], ...remainingLobbyData },
    ],
    ["LOBBY_STATE_CHANGE", { users: [bob.toJSON()], ...remainingLobbyData }],
  ];

  expect(socket1.getEmittedMessages()).toMatchPackets(expectedResult);
});

test("Should broadcast chat messages", () => {
  const bob = new User(1, "Bob");
  const george = new User(2, "George");

  const socket1 = new MockSocket(bob);
  const socket2 = new MockSocket(george);

  LobbyHandler(socket1, MockIO);
  LobbyHandler(socket2, MockIO);

  socket1.mockReceive("JOIN_LOBBY", 12345);
  socket2.mockReceive("JOIN_LOBBY", 12345);
  socket2.mockReceive("SEND_LOBBY_CHAT_MESSAGE", "HELLOOO");

  expect(socket1.getEmittedMessages().splice(2)).toMatchPackets([
    [
      "LOBBY_CHAT_MESSAGE",
      { sender: george.toJSON(), message: "HELLOOO", id: Anything },
    ],
  ]);
});

test("Leader should be able to select and start games", () => {
  const bob = new User(1, "Bob");
  const george = new User(2, "George");

  const socket1 = new MockSocket(bob);
  const socket2 = new MockSocket(george);

  LobbyHandler(socket1, MockIO);
  LobbyHandler(socket2, MockIO);

  socket1.mockReceive("JOIN_LOBBY", 2425);
  socket2.mockReceive("JOIN_LOBBY", 2425);
  socket2.mockReceive("SELECT_GAME", "bomb");
  socket2.mockReceive("START_GAME");

  const remainingLobbyData = {
    id: 2425,
    gameId: "bomb",
    users: [bob.toJSON(), george.toJSON()],
  };

  expect(socket1.getEmittedMessages().splice(2)).toMatchPackets([
    ["LOBBY_STATE_CHANGE", { inGame: false, ...remainingLobbyData }],
    ["LOBBY_STATE_CHANGE", { inGame: true, ...remainingLobbyData }],
  ]);
});

test("Disconnected users should automatically be removed.", () => {
  const bob = new User(1, "Bob");
  const george = new User(2, "George");

  const socket1 = new MockSocket(bob);
  const socket2 = new MockSocket(george);

  LobbyHandler(socket1, MockIO);
  LobbyHandler(socket2, MockIO);

  socket1.mockReceive("JOIN_LOBBY", 24);
  socket2.mockReceive("JOIN_LOBBY", 24);
  socket2.mockReceive("disconnect");

  const remainingLobbyData = {
    id: 24,
    gameId: "test",
    inGame: false,
  };

  const expectedResult = [
    ["LOBBY_STATE_CHANGE", { users: [bob.toJSON()], ...remainingLobbyData }],
    [
      "LOBBY_STATE_CHANGE",
      { users: [bob.toJSON(), george.toJSON()], ...remainingLobbyData },
    ],
    ["LOBBY_STATE_CHANGE", { users: [bob.toJSON()], ...remainingLobbyData }],
  ];

  expect(socket1.getEmittedMessages()).toMatchPackets(expectedResult);
});
