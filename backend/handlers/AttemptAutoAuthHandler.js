const jwt = require("jsonwebtoken");
const config = require("../config");

const AttemptAutoAuthHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function (token) {
      jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (decoded) {
          socket.user = decoded;
          socket.authToken = token;
        }
      });
    });
  };
};

module.exports = AttemptAutoAuthHandler;
