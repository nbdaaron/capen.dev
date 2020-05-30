const { createSuccessResponse, createErrorResponse } = require("../response");
const database = require("../database");
const bcrypt = require("bcrypt");

const INCORRECT_CREDENTIALS_ERROR = createErrorResponse(
  "Login Error: These credentials are incorrect!"
);

const LoginHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function (info) {
      database.query(
        "SELECT `id`, `password` FROM `Users` WHERE `username` = ?",
        [info.username],
        (error, results, fields) => {
          if (error) {
            socket.emit(sendOp, createErrorResponse(error.sqlMessage));
          } else if (results.length === 0) {
            // Username not found
            socket.emit(sendOp, INCORRECT_CREDENTIALS_ERROR);
          } else {
            const matchedUser = results[0];
            // Check password
            bcrypt
              .compare(info.password, matchedUser.password)
              .then((passwordCorrect) => {
                if (passwordCorrect) {
                  socket.user = {
                    id: matchedUser.id,
                    name: info.username,
                    authToken: "nbdaaron",
                  };
                  socket.emit(sendOp, createSuccessResponse(socket.user));
                } else {
                  // Password is incorrect
                  socket.emit(sendOp, INCORRECT_CREDENTIALS_ERROR);
                }
              });
          }
        }
      );
    });
  };
};

module.exports = LoginHandler;
