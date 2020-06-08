const Guest = require("./Guest");
const User = require("./User");

test("creates a User object", () => {
  const guest = new Guest();
  expect(guest).toBeInstanceOf(User);
});

test("generates unique random IDs", () => {
  const guest1 = new Guest();
  const guest2 = new Guest();
  expect(guest1.id).not.toEqual(guest2.id);
});

test("generates unique random names", () => {
  const guest1 = new Guest();
  const guest2 = new Guest();
  expect(guest1.name).not.toEqual(guest2.name);
});
