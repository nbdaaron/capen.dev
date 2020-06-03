const { SuccessResponse } = require("../model/response");
const Message = require("../model/message");
const Lobby = require("../model/lobby");
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

const lobbies = {};

const LobbyHandler = (socket, io) => {
  socket.on(
    GET_EMPTY_LOBBY_ID,
    authenticatedOnly(socket, function () {
      let id = Lobby.generateRandomId();
      while (lobbies[id]) {
        id = Lobby.generateRandomId();
      }
      socket.emit(EMPTY_LOBBY_ID_RESPONSE, new SuccessResponse(id));
    })
  );

  socket.on(
    JOIN_LOBBY,
    authenticatedOnly(socket, function (lobbyId) {
      // Lobby is empty, create lobby.
      if (!lobbies[lobbyId]) {
        lobbies[lobbyId] = new Lobby(lobbyId, socket.user);
      } else {
        lobbies[lobbyId].addUser(socket.user);
      }
      socket.user.lobby = lobbies[lobbyId];
      socket.join(lobbyId);
      io.to(lobbyId).emit(LOBBY_STATE_CHANGE, lobbies[lobbyId]);
    })
  );

  socket.on(
    LEAVE_LOBBY,
    inLobbyOnly(socket, function () {
      const lobby = socket.user.lobby;
      lobby.removeUser(socket.user);
      delete socket.user.lobby;
      if (lobby.isEmpty()) {
        lobby.cleanup();
        delete lobbies[lobby.id];
      }
      io.to(lobby.id).emit(LOBBY_STATE_CHANGE, lobby);
      socket.leave(lobby.id);
    })
  );

  socket.on(
    SEND_LOBBY_CHAT_MESSAGE,
    inLobbyOnly(socket, function (message) {
      const lobby = socket.user.lobby;
      io.to(lobby.id).emit(
        LOBBY_CHAT_MESSAGE,
        new Message(socket.user, message)
      );
    })
  );

  socket.on(
    SELECT_GAME,
    inLobbyOnly(socket, function (gameId) {
      const lobby = socket.user.lobby;
      lobbies[lobby.id].gameId = gameId;
      io.to(lobby.id).emit(LOBBY_STATE_CHANGE, lobby);
    })
  );

  socket.on(
    START_GAME,
    inLobbyOnly(socket, function () {
      const lobby = socket.user.lobby;
      lobby.startGame(io);
      io.to(lobby.id).emit(LOBBY_STATE_CHANGE, lobby);
    })
  );

  // Disconnect handler
  socket.on(
    "disconnect",
    inLobbyOnly(socket, function () {
      const lobby = socket.user.lobby;
      lobby.removeUser(socket.user);
      delete socket.user.lobby;
      if (lobby.isEmpty()) {
        lobby.cleanup();
        delete lobbies[lobby.id];
      }
      io.to(lobby.id).emit(LOBBY_STATE_CHANGE, lobby);
      socket.leave(lobby.id);
    })
  );
};

module.exports = LobbyHandler;
