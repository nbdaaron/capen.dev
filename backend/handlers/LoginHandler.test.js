const LoginHandler = require("./LoginHandler");
const { MockSocket } = require("../mock/MockSocketIO");
const User = require("../model/user");
const waitForExpect = require("wait-for-expect");
const { Anything } = require("../testingUtil");

jest.mock("../config", () => ({
  jwtSecret: "abc123",
}));

jest.mock("../database", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const bcrypt = require("bcrypt");
const database = require("../database");
const jwt = require("jsonwebtoken");

test("Should return user for valid login credentials", async () => {
  bcrypt.compare.mockResolvedValue(true);
  jwt.sign.mockImplementation((user, secret, cb) => {
    cb(null, "authToken");
  });
  database.query.mockImplementation((query, data, cb) => {
    cb(null, [{ id: 3, username: "aaron", password: "somehash" }]);
  });

  const socket = new MockSocket();
  LoginHandler(socket);

  socket.mockReceive("TRY_LOGIN", { username: "aaron", password: "password" });
  await waitForExpect(() =>
    expect(socket.getEmittedMessages()).toMatchPackets([
      [
        "LOGIN_RESPONSE",
        {
          success: true,
          data: { id: 3, name: "aaron", authToken: "authToken" },
        },
      ],
    ])
  );
  expect(socket.user.equals(new User(3, "aaron"))).toEqual(true);
});

test("Should fail for invalid login credentials", async () => {
  bcrypt.compare.mockResolvedValue(false);
  database.query.mockImplementation((query, data, cb) => {
    cb(null, [{ id: 3, username: "aaron", password: "somehash" }]);
  });

  const socket = new MockSocket();
  LoginHandler(socket);

  socket.mockReceive("TRY_LOGIN", {
    username: "aaron",
    password: "wrongPassword",
  });
  const response = {
    success: false,
    error: "Login Error: These credentials are incorrect!",
  };
  await waitForExpect(() =>
    expect(socket.getEmittedMessages()).toMatchPackets([
      ["LOGIN_RESPONSE", response],
    ])
  );
  expect(socket.user).toBeUndefined();
});

test("Should allow login as guest", async () => {
  jwt.sign.mockImplementation((user, secret, cb) => {
    cb(null, "authToken");
  });

  const socket = new MockSocket();
  LoginHandler(socket);

  socket.mockReceive("LOGIN_AS_GUEST");
  await waitForExpect(() =>
    expect(socket.getEmittedMessages()).toMatchPackets([
      [
        "LOGIN_RESPONSE",
        {
          success: true,
          data: { id: Anything, name: Anything, authToken: "authToken" },
        },
      ],
    ])
  );
  expect(socket.user).toBeInstanceOf(User);
});
