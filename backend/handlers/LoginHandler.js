const { SuccessResponse, ErrorResponse } = require("../model/response");
const database = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../model/User");

// RECV_OPS
const TRY_LOGIN = "TRY_LOGIN";

// SEND_OPS
const LOGIN_RESPONSE = "LOGIN_RESPONSE";

const INCORRECT_CREDENTIALS_ERROR = new ErrorResponse(
  "Login Error: These credentials are incorrect!"
);

const LoginHandler = (socket) => {
  socket.on(TRY_LOGIN, function (info) {
    database.query(
      "SELECT `id`, `password` FROM `Users` WHERE `username` = ?",
      [info.username],
      (error, results, fields) => {
        if (error) {
          socket.emit(LOGIN_RESPONSE, new ErrorResponse(error.sqlMessage));
        } else if (results.length === 0) {
          // Username not found
          socket.emit(LOGIN_RESPONSE, INCORRECT_CREDENTIALS_ERROR);
        } else {
          const matchedUser = results[0];
          // Check password
          bcrypt
            .compare(info.password, matchedUser.password)
            .then((passwordCorrect) => {
              if (passwordCorrect) {
                socket.user = new User(matchedUser.id, info.username);
                const userJson = socket.user.toJSON();
                jwt.sign(userJson, config.jwtSecret, (err, token) => {
                  if (err) {
                    throw err;
                  }
                  userJson.authToken = token;
                  socket.emit(LOGIN_RESPONSE, new SuccessResponse(userJson));
                });
              } else {
                // Password is incorrect
                socket.emit(LOGIN_RESPONSE, INCORRECT_CREDENTIALS_ERROR);
              }
            });
        }
      }
    );
  });
};
module.exports = LoginHandler;
