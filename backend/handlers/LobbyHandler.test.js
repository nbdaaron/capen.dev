const LobbyHandler = require("./LobbyHandler");
const { MockSocket, MockIO } = require("./MockSocketIO");
const User = require("../model/user");
const Lobby = require("../model/lobby");
const Message = require("../model/message");
const { Anything } = require("../testingUtil");

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

  const lobby = new Lobby(12345, bob);

  const socket1 = new MockSocket(bob);
  const socket2 = new MockSocket(george);

  LobbyHandler(socket1, MockIO);
  LobbyHandler(socket2, MockIO);

  socket1.mockReceive("JOIN_LOBBY", 12345);
  socket2.mockReceive("JOIN_LOBBY", 12345);
  socket2.mockReceive("LEAVE_LOBBY", 12345);

  const expectedResult = [
    ["LOBBY_STATE_CHANGE", lobby],
    ["LOBBY_STATE_CHANGE", lobby],
    ["LOBBY_STATE_CHANGE", lobby],
  ];

  expect(socket1.getEmittedMessages()).toMatchPackets(expectedResult);
});

test("Should broadcast chat messages", () => {
  // Keep message IDs the same
  const mockMath = Object.create(global.Math);
  mockMath.random = () => 0.5;
  global.Math = mockMath;

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
    ["LOBBY_CHAT_MESSAGE", new Message(george, "HELLOOO")],
  ]);
});
