// RECV_OPS
const PING = "PING";

// SEND_OPS
const PONG = "PONG";

const PingHandler = (socket) => {
  socket.on(PING, function (info) {
    socket.emit(PONG);
  });
};

module.exports = PingHandler;
