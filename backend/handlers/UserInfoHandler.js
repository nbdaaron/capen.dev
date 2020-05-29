const { SEND_OPS, RECV_OPS } = require("../opcodes");
const { createSuccessResponse, createErrorResponse } = require("../response");

const NOT_LOGGED_IN_ERROR = createErrorResponse(
  "User Info Error: You're not logged in!"
);

const UserInfoHandler = (socket) => {
  socket.on(RECV_OPS.GET_USER_INFO, function (info) {
    if (!socket.user) {
      socket.emit(SEND_OPS.USER_INFO_RESPONSE, NOT_LOGGED_IN_ERROR);
      return;
    }
    socket.emit(
      SEND_OPS.USER_INFO_RESPONSE,
      createSuccessResponse(socket.user)
    );
  });
};

module.exports = UserInfoHandler;
