const { SEND_OPS, RECV_OPS } = require("../opcodes");
const { createSuccessResponse, createErrorResponse } = require("../response");

const INCORRECT_CREDENTIALS_ERROR = createErrorResponse(
  "Login Error: These credentials are incorrect!"
);

const LoginHandler = (socket) => {
  socket.on(RECV_OPS.TRY_LOGIN, function (info) {
    if (info.username === "aaron") {
      socket.emit(SEND_OPS.LOGIN_RESPONSE, INCORRECT_CREDENTIALS_ERROR);
      return;
    }
    // emit dummy response
    socket.user = {
      id: 1,
      name: info.username,
    };
    socket.emit(SEND_OPS.LOGIN_RESPONSE, createSuccessResponse(socket.user));
  });
};

module.exports = LoginHandler;
