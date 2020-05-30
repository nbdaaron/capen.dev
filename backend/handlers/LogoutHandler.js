const { RECV_OPS } = require("../opcodes");

const LogoutHandler = (socket) => {
  socket.on(RECV_OPS.LOGOUT, function () {
    delete socket.user;
  });
};

module.exports = LogoutHandler;
