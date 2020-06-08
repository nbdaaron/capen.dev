const AttemptAutoAuthHandler = require("./AttemptAutoAuthHandler");
const { MockSocket } = require("../mock/MockSocketIO");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

jest.mock("../config", () => ({
  jwtSecret: "abc123",
}));

const config = require("../config");

test("Should set socket.user for a correct authToken", async () => {
  const socket = new MockSocket();
  AttemptAutoAuthHandler(socket);

  const bob = new User(123, "bob");
  jwt.sign(bob.toJSON(), config.jwtSecret, (err, token) => {
    socket.mockReceive("ATTEMPT_AUTO_AUTH", token);
    expect(socket.user.equals(bob)).toEqual(true);
  });
});

test("Should not set socket.user for an incorrect authToken", () => {
  const socket = new MockSocket();
  AttemptAutoAuthHandler(socket);
  socket.mockReceive("ATTEMPT_AUTO_AUTH", "abcdefg");
  expect(socket.user).toBeUndefined();
});
