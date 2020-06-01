const Message = require("./message");
const Guest = require("./guest");

const bob = new Guest();

test("generates unique random IDs", () => {
  const message1 = new Message(bob, "hello");
  const message2 = new Message(bob, "hello");
  expect(message1.id).not.toEqual(message2.id);
});
