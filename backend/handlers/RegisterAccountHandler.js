const { SuccessResponse, ErrorResponse } = require("../model/Response");
const { registerUser } = require("../database/User");

// RECV_OPS
const REGISTER_ACCOUNT = "REGISTER_ACCOUNT";

// SEND_OPS
const REGISTER_RESPONSE = "REGISTER_RESPONSE";

const USERNAME_TOO_SHORT_ERROR = new ErrorResponse(
  "Register Account Error: Username must be atleast 5 characters!"
);
const PASSWORD_TOO_SHORT_ERROR = new ErrorResponse(
  "Register Account Error: Password must be atleast 5 characters!"
);

const RegisterAccountHandler = (socket) => {
  socket.on(REGISTER_ACCOUNT, function (info) {
    if (typeof info.username !== "string" || info.username.length < 5) {
      socket.emit(REGISTER_RESPONSE, USERNAME_TOO_SHORT_ERROR);
      return;
    }
    if (typeof info.password !== "string" || info.password.length < 5) {
      socket.emit(REGISTER_RESPONSE, PASSWORD_TOO_SHORT_ERROR);
      return;
    }
    registerUser(info.username, info.password, info.email)
      .then(() => socket.emit(REGISTER_RESPONSE, new SuccessResponse()))
      .catch((err) =>
        socket.emit(REGISTER_RESPONSE, new ErrorResponse(err.message))
      );
  });
};

module.exports = RegisterAccountHandler;
