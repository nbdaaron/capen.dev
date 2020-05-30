const { SEND_OPS, RECV_OPS } = require("../opcodes");
const { createSuccessResponse, createErrorResponse } = require("../response");
const database = require("../database");
const bcrypt = require("bcrypt");

const INCORRECT_CREDENTIALS_ERROR = createErrorResponse(
  "Login Error: These credentials are incorrect!"
);

const LoginHandler = (socket) => {
  socket.on(RECV_OPS.TRY_LOGIN, function (info) {
    database.query(
      "SELECT `id`, `password` FROM `Users` WHERE `username` = ?",
      [info.username],
      (error, results, fields) => {
        if (error) {
          socket.emit(
            SEND_OPS.LOGIN_RESPONSE,
            createErrorResponse(error.sqlMessage)
          );
        } else if (results.length === 0) {
          // Username not found
          socket.emit(SEND_OPS.LOGIN_RESPONSE, INCORRECT_CREDENTIALS_ERROR);
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
                socket.emit(
                  SEND_OPS.LOGIN_RESPONSE,
                  createSuccessResponse(socket.user)
                );
              } else {
                // Password is incorrect
                socket.emit(
                  SEND_OPS.LOGIN_RESPONSE,
                  INCORRECT_CREDENTIALS_ERROR
                );
              }
            });
        }
      }
    );
  });
};

module.exports = LoginHandler;
