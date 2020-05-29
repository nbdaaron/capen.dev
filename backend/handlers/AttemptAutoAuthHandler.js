const { RECV_OPS } = require("../opcodes");

const AttemptAutoAuthHandler = (socket) => {
  socket.on(RECV_OPS.ATTEMPT_AUTO_AUTH, function (token) {
    if (token === "nbdaaron") {
      socket.user = {
        id: 1,
        name: "nbdaaron",
        authToken: "nbdaaron",
      };
    }
  });
};

module.exports = AttemptAutoAuthHandler;
