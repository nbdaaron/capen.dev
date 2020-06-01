const { SuccessResponse, ErrorResponse } = require("./response");

test("Success Response should be successful", () => {
  expect(new SuccessResponse().success).toEqual(true);
});

test("Error Response should not be successful", () => {
  expect(new ErrorResponse().success).toEqual(false);
});
