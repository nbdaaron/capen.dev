const { SEND_OPS, RECV_OPS } = require('../opcodes');
const { createSuccessResponse, createErrorResponse } = require('../response');

const USERNAME_TOO_SHORT_ERROR = createErrorResponse('Register Account Error: Username must be atleast 5 characters!'); 
const USERNAME_TAKEN_ERROR = createErrorResponse('Register Account Error: This username is already taken.');

const RegisterAccountHandler = (socket) => {
  socket.on(RECV_OPS.REGISTER_ACCOUNT, function (info) {
    if (typeof info.username !== 'string' || info.username.length < 5) {
      socket.emit(SEND_OPS.REGISTER_RESPONSE, USERNAME_TOO_SHORT_ERROR);
      return;
    }
    if (info.username === 'aaron') {
      socket.emit(SEND_OPS.REGISTER_RESPONSE, USERNAME_TAKEN_ERROR);
      return;
    }
    // emit dummy response
    socket.emit(SEND_OPS.REGISTER_RESPONSE, createSuccessResponse());
  }); 
};

module.exports = RegisterAccountHandler;