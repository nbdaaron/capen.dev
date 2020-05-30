const AttemptAutoAuthHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function (token) {
      if (token === "nbdaaron") {
        socket.user = {
          id: 1,
          name: "nbdaaron",
          authToken: "nbdaaron",
        };
      }
    });
  };
};

module.exports = AttemptAutoAuthHandler;
