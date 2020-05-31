const { SuccessResponse } = require("../model/response");

const GET_USER_INFO = "GET_USER_INFO";
const USER_INFO_RESPONSE = "USER_INFO_RESPONSE";

/**
 * User Info handler serves 2 purposes:
 *   1. If unauthenticated (or auth token expired), let the user know.
 *       - (socket.user) will be null
 *   2. Return authenticated user profile information to display.
 */
const UserInfoHandler = (socket) => {
  socket.on(GET_USER_INFO, function (info) {
    socket.emit(USER_INFO_RESPONSE, new SuccessResponse(socket.user));
  });
};

module.exports = UserInfoHandler;
