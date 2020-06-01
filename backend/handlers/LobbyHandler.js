const {
  getEmptyLobbyId,
  getLobby,
  joinLobby,
  leaveLobby,
} = require("../games/lobbies");
const { SuccessResponse } = require("../model/response");
const Message = require("../model/message");
const { authenticatedOnly } = require("./util");

// RECV_OPS
const GET_EMPTY_LOBBY_ID = "GET_EMPTY_LOBBY_ID";
const JOIN_LOBBY = "JOIN_LOBBY";
const LEAVE_LOBBY = "LEAVE_LOBBY";
const SEND_LOBBY_CHAT_MESSAGE = "SEND_LOBBY_CHAT_MESSAGE";

// SEND_OPS
const EMPTY_LOBBY_ID_RESPONSE = "EMPTY_LOBBY_ID_RESPONSE";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";
const LOBBY_CHAT_MESSAGE = "LOBBY_CHAT_MESSAGE";

const LobbyHandler = (socket, io) => {
  socket.on(
    GET_EMPTY_LOBBY_ID,
    authenticatedOnly(socket, function () {
      socket.emit(
        EMPTY_LOBBY_ID_RESPONSE,
        new SuccessResponse(getEmptyLobbyId())
      );
    })
  );

  socket.on(
    JOIN_LOBBY,
    authenticatedOnly(socket, function (lobbyId) {
      joinLobby(lobbyId, socket.user);
      socket.join(lobbyId);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
    })
  );

  socket.on(
    LEAVE_LOBBY,
    authenticatedOnly(socket, function () {
      const lobbyId = socket.user.lobbyId;
      if (lobbyId) {
        leaveLobby(lobbyId, socket.user);
        io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
        socket.leave(lobbyId);
      }
    })
  );

  socket.on(
    SEND_LOBBY_CHAT_MESSAGE,
    authenticatedOnly(socket, function (message) {
      const lobbyId = socket.user.lobbyId;
      if (lobbyId) {
        io.to(lobbyId).emit(
          LOBBY_CHAT_MESSAGE,
          new Message(socket.user, message)
        );
      }
    })
  );

  // Disconnect handler
  socket.on(
    "disconnect",
    authenticatedOnly(socket, function () {
      const lobbyId = socket.user.lobbyId;
      if (lobbyId) {
        leaveLobby(lobbyId, socket.user);
        io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
        socket.leave(lobbyId);
      }
    })
  );
};

module.exports = LobbyHandler;
