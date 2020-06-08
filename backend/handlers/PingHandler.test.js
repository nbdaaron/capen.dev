const PingHandler = require("./PingHandler");
const { MockSocket } = require("../mock/MockSocketIO");

test("Should respond to a ping request", () => {
  const socket = new MockSocket();
  PingHandler(socket);

  socket.mockReceive("PING");
  expect(socket.getEmittedMessages()).toMatchPackets([["PONG"]]);
});
