const { createSuccessResponse } = require("../response");

/**
 * User Info handler serves 2 purposes:
 *   1. If unauthenticated (or auth token expired), let the user know.
 *       - (socket.user) will be null
 *   2. Return authenticated user profile information to display.
 */
const UserInfoHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function (info) {
      socket.emit(sendOp, createSuccessResponse(socket.user || {}));
    });
  };
};

module.exports = UserInfoHandler;
