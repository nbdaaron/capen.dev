const Lobby = require("./Lobby");
const Guest = require("./Guest");

const dummyUser = new Guest();

jest.mock("../database/Game", () => ({
  recordResults: jest.fn(),
}));

test("Lobby leader should be first user to join", () => {
  const lobby = new Lobby(Lobby.generateRandomId(), dummyUser);
  expect(lobby.getLeader()).toEqual(dummyUser);

  const bob = new Guest();
  lobby.addUser(bob);
  expect(lobby.getLeader()).toEqual(dummyUser);
});

test("Lobby leadership should transfer when leader leaves", () => {
  const lobby = new Lobby(Lobby.generateRandomId(), dummyUser);
  const bob = new Guest();
  lobby.addUser(bob);

  lobby.removeUser(dummyUser);
  expect(lobby.getLeader()).toEqual(bob);
});
