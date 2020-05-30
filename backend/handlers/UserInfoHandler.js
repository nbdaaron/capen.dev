const { SEND_OPS, RECV_OPS } = require("../opcodes");
const { createSuccessResponse } = require("../response");

/**
 * User Info handler serves 2 purposes:
 *   1. If unauthenticated (or auth token expired), let the user know.
 *       - (socket.user) will be null
 *   2. Return authenticated user profile information to display.
 */
const UserInfoHandler = (socket) => {
  socket.on(RECV_OPS.GET_USER_INFO, function (info) {
    socket.emit(
      SEND_OPS.USER_INFO_RESPONSE,
      createSuccessResponse(socket.user || {})
    );
  });
};

module.exports = UserInfoHandler;
