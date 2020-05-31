const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../model/user");

// RECV_OPS
const ATTEMPT_AUTO_AUTH = "ATTEMPT_AUTO_AUTH";

const AttemptAutoAuthHandler = (socket) => {
  socket.on(ATTEMPT_AUTO_AUTH, function (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (decoded) {
        // decoded.authToken = token;
        socket.user = new User(decoded.id, decoded.name);
      }
    });
  });
};

module.exports = AttemptAutoAuthHandler;
