// RECV_OPS
const LOGOUT = "LOGOUT";

const LogoutHandler = (socket) => {
  socket.on(LOGOUT, function () {
    delete socket.user;
  });
};

module.exports = LogoutHandler;
