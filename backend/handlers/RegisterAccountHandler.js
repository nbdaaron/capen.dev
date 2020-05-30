const { createSuccessResponse, createErrorResponse } = require("../response");
const database = require("../database");
const bcrypt = require("bcrypt");

const USERNAME_TOO_SHORT_ERROR = createErrorResponse(
  "Register Account Error: Username must be atleast 5 characters!"
);
const PASSWORD_TOO_SHORT_ERROR = createErrorResponse(
  "Register Account Error: Password must be atleast 5 characters!"
);
const USERNAME_TAKEN_ERROR = createErrorResponse(
  "Register Account Error: This username is already taken."
);

const RegisterAccountHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function (info) {
      if (typeof info.username !== "string" || info.username.length < 5) {
        socket.emit(sendOp, USERNAME_TOO_SHORT_ERROR);
        return;
      }
      if (typeof info.password !== "string" || info.password.length < 5) {
        socket.emit(sendOp, PASSWORD_TOO_SHORT_ERROR);
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
                socket.emit(sendOp, USERNAME_TAKEN_ERROR);
              } else {
                socket.emit(sendOp, createErrorResponse(error.sqlMessage));
              }
            } else {
              socket.emit(sendOp, createSuccessResponse());
            }
          }
        );
      });
    });
  };
};

module.exports = RegisterAccountHandler;
