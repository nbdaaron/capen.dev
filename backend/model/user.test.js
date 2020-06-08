const User = require("./User");

test("users with the same id/name should be equal", () => {
  const aaron1 = new User(123, "aaron");
  const aaron2 = new User(123, "aaron");

  expect(aaron1.equals(aaron2)).toEqual(true);
});

test("converting user to JSON should not include sensitive data", () => {
  const aaron = new User(123, "aaron");
  aaron.authToken = "secretAuthToken";

  expect(JSON.stringify(aaron)).not.toContain("secretAuthToken");
});
