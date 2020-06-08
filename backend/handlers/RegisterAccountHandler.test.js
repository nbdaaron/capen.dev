const RegisterAccountHandler = require("./RegisterAccountHandler");
const { MockSocket } = require("../mock/MockSocketIO");
const { Anything } = require("../testingUtil");
const waitForExpect = require("wait-for-expect");

jest.mock("../config", () => ({
  jwtSecret: "abc123",
}));

jest.mock("../database/User", () => ({
  registerUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const bcrypt = require("bcrypt");
const { registerUser } = require("../database/User");

test("Should fail if username too short", async () => {
  const socket = new MockSocket();
  RegisterAccountHandler(socket);

  socket.mockReceive("REGISTER_ACCOUNT", {
    username: "a",
    password: "password",
    email: "email",
  });
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["REGISTER_RESPONSE", { success: false, error: Anything }],
  ]);
});

test("Should fail if password too short", async () => {
  const socket = new MockSocket();
  RegisterAccountHandler(socket);

  socket.mockReceive("REGISTER_ACCOUNT", {
    username: "aaron",
    password: "p",
    email: "email",
  });
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["REGISTER_RESPONSE", { success: false, error: Anything }],
  ]);
});

test("Should fail if username is taken", async () => {
  bcrypt.hash.mockResolvedValue(123);
  registerUser.mockRejectedValue(new Error("Username is taken!"));

  const socket = new MockSocket();
  RegisterAccountHandler(socket);

  socket.mockReceive("REGISTER_ACCOUNT", {
    username: "a",
    password: "password",
    email: "email",
  });
  expect(socket.getEmittedMessages()).toMatchPackets([
    ["REGISTER_RESPONSE", { success: false, error: Anything }],
  ]);
});

test("Should emit success response on success", async () => {
  bcrypt.hash.mockResolvedValue(123);
  registerUser.mockResolvedValue();

  const socket = new MockSocket();
  RegisterAccountHandler(socket);

  socket.mockReceive("REGISTER_ACCOUNT", {
    username: "aaron",
    password: "password",
    email: "email",
  });
  await waitForExpect(() =>
    expect(socket.getEmittedMessages()).toMatchPackets([
      ["REGISTER_RESPONSE", { success: true }],
    ])
  );
});
