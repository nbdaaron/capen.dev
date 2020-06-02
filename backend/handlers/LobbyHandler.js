const {
  getEmptyLobbyId,
  getLobby,
  joinLobby,
  leaveLobby,
  startGame,
} = require("../games/lobbies");
const { SuccessResponse } = require("../model/response");
const Message = require("../model/message");
const { authenticatedOnly, inLobbyOnly } = require("./util");

// RECV_OPS
const GET_EMPTY_LOBBY_ID = "GET_EMPTY_LOBBY_ID";
const JOIN_LOBBY = "JOIN_LOBBY";
const LEAVE_LOBBY = "LEAVE_LOBBY";
const SEND_LOBBY_CHAT_MESSAGE = "SEND_LOBBY_CHAT_MESSAGE";
const SELECT_GAME = "SELECT_GAME";
const START_GAME = "START_GAME";

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
    inLobbyOnly(socket, function () {
      const lobbyId = socket.user.lobbyId;
      leaveLobby(lobbyId, socket.user);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
      socket.leave(lobbyId);
    })
  );

  socket.on(
    SEND_LOBBY_CHAT_MESSAGE,
    inLobbyOnly(socket, function (message) {
      const lobbyId = socket.user.lobbyId;
      io.to(lobbyId).emit(
        LOBBY_CHAT_MESSAGE,
        new Message(socket.user, message)
      );
    })
  );

  socket.on(
    SELECT_GAME,
    inLobbyOnly(socket, function (game) {
      const lobbyId = socket.user.lobbyId;
      getLobby(lobbyId).setGame(game);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
    })
  );

  socket.on(
    START_GAME,
    inLobbyOnly(socket, function () {
      const lobbyId = socket.user.lobbyId;
      startGame(io, lobbyId);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
    })
  );

  // Disconnect handler
  socket.on(
    "disconnect",
    inLobbyOnly(socket, function () {
      const lobbyId = socket.user.lobbyId;
      leaveLobby(lobbyId, socket.user);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
      socket.leave(lobbyId);
    })
  );
};

module.exports = LobbyHandler;
