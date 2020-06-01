const RegisterAccountHandler = require("./RegisterAccountHandler");
const { MockSocket } = require("../mock/MockSocketIO");
const { Anything } = require("../testingUtil");
const waitForExpect = require("wait-for-expect");

jest.mock("../config", () => ({
  jwtSecret: "abc123",
}));

jest.mock("../database", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const bcrypt = require("bcrypt");
const database = require("../database");

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
  database.query.mockImplementation((query, data, cb) => {
    cb({ code: "ER_DUP_ENTRY" });
  });

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
  database.query.mockImplementation((query, data, cb) => {
    cb();
  });

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
