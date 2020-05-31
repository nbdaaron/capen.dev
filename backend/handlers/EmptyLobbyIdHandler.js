const { getEmptyLobbyId } = require("../games/lobbies");
const { createSuccessResponse } = require("../response");

const EmptyLobbyIdHandler = (recvOp, sendOp) => {
  return (socket) => {
    socket.on(recvOp, function () {
      socket.emit(sendOp, createSuccessResponse(getEmptyLobbyId()));
    });
  };
};

module.exports = EmptyLobbyIdHandler;
