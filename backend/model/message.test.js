const Message = require("./Message");
const Guest = require("./Guest");

const bob = new Guest();

test("generates unique random IDs", () => {
  const message1 = new Message(bob, "hello");
  const message2 = new Message(bob, "hello");
  expect(message1.id).not.toEqual(message2.id);
});
