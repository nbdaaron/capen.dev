const { SuccessResponse, ErrorResponse } = require("../model/Response");
const { login } = require("../database/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Guest = require("../model/Guest");

// RECV_OPS
const TRY_LOGIN = "TRY_LOGIN";
const LOGIN_AS_GUEST = "LOGIN_AS_GUEST";

// SEND_OPS
const LOGIN_RESPONSE = "LOGIN_RESPONSE";

const LoginHandler = (socket) => {
  socket.on(TRY_LOGIN, function (info) {
    login(info.username, info.password)
      .then((user) => {
        socket.user = user;
        const userJson = socket.user.toJSON();
        jwt.sign(userJson, config.jwtSecret, (err, token) => {
          if (err) {
            throw err;
          }
          userJson.authToken = token;
          socket.emit(LOGIN_RESPONSE, new SuccessResponse(userJson));
        });
      })
      .catch((err) =>
        socket.emit(LOGIN_RESPONSE, new ErrorResponse(err.message))
      );
  });

  socket.on(LOGIN_AS_GUEST, function () {
    socket.user = new Guest();
    const userJson = socket.user.toJSON();
    jwt.sign(userJson, config.jwtSecret, (err, token) => {
      if (err) {
        throw err;
      }
      userJson.authToken = token;
      socket.emit(LOGIN_RESPONSE, new SuccessResponse(userJson));
    });
  });
};
module.exports = LoginHandler;
