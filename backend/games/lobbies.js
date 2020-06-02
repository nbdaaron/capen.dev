const Lobby = require("../model/lobby");

// Lobbies are stored in memory
const lobbies = {};

// SEND_OPS
const DECLARE_WINNER = "DECLARE_WINNER";
const LOBBY_STATE_CHANGE = "LOBBY_STATE_CHANGE";

const getLobby = (id) => lobbies[id];
const getEmptyLobbyId = () => {
  let id = Lobby.generateRandomId();
  while (lobbies[id]) {
    id = Lobby.generateRandomId();
  }
  return id;
};

const joinLobby = (lobbyId, user) => {
  // Lobby is empty, create lobby.
  if (!lobbies[lobbyId]) {
    lobbies[lobbyId] = new Lobby(lobbyId, user);
  } else {
    lobbies[lobbyId].addUser(user);
  }
  user.lobbyId = lobbies[lobbyId].id;
  return lobbies[lobbyId];
};

const leaveLobby = (lobbyId, user) => {
  // Lobby doesn't exist
  if (!lobbies[lobbyId]) {
    return;
  }
  lobbies[lobbyId].removeUser(user);

  if (user.lobbyId) {
    delete user.lobbyId;
  }

  if (lobbies[lobbyId].isEmpty()) {
    delete lobbies[lobbyId];
  }
};

const finishGame = (io, lobbyId, winner) => {
  if (!lobbies[lobbyId]) {
    return;
  }
  lobbies[lobbyId].setInGame(false);
  io.to(lobbyId).emit(DECLARE_WINNER, winner);

  io.to(lobbyId).emit(LOBBY_STATE_CHANGE, getLobby(lobbyId));
};

module.exports = {
  getEmptyLobbyId: getEmptyLobbyId,
  getLobby: getLobby,
  joinLobby: joinLobby,
  leaveLobby: leaveLobby,
  finishGame: finishGame,
};
