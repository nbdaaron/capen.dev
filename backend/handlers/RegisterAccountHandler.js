const { SuccessResponse, ErrorResponse } = require("../model/response");
const database = require("../database");
const bcrypt = require("bcrypt");

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
const USERNAME_TAKEN_ERROR = new ErrorResponse(
  "Register Account Error: This username is already taken."
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
    // Hash the password
    bcrypt.hash(info.password, 10).then((hash) => {
      info.password = hash;
      database.query(
        "INSERT INTO Users SET ?",
        info,
        (error, results, fields) => {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              socket.emit(REGISTER_RESPONSE, USERNAME_TAKEN_ERROR);
            } else {
              socket.emit(
                REGISTER_RESPONSE,
                new ErrorResponse(error.sqlMessage)
              );
            }
          } else {
            socket.emit(REGISTER_RESPONSE, new SuccessResponse());
          }
        }
      );
    });
  });
};

module.exports = RegisterAccountHandler;
