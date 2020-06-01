const UserInfoHandler = require("./UserInfoHandler");
const { MockSocket } = require("../mock/MockSocketIO");

test("Should emit user info for logged in user", async () => {
  const socket = new MockSocket();
  socket.user = { a: 3 };
  UserInfoHandler(socket);

  socket.mockReceive("GET_USER_INFO");
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["USER_INFO_RESPONSE", { success: true, data: socket.user }],
  ]);
});

test("Should emit undefined for logged out user", async () => {
  const socket = new MockSocket();
  UserInfoHandler(socket);

  socket.mockReceive("GET_USER_INFO");
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["USER_INFO_RESPONSE", { success: true }],
  ]);
});
