const LogoutHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function () {
      delete socket.user;
    });
  };
};

module.exports = LogoutHandler;
