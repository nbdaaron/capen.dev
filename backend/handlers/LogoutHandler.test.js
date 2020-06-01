const LogoutHandler = require("./LogoutHandler");
const { MockSocket } = require("../mock/MockSocketIO");

test("Should delete socket.user", async () => {
  const socket = new MockSocket();
  socket.user = { a: 3 };
  LogoutHandler(socket);

  socket.mockReceive("LOGOUT");
  expect(socket.user).toBeUndefined();
});
