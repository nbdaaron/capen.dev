const Lobby = require("../model/lobby");

// Lobbies are stored in memory
const lobbies = {};

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

module.exports = {
  getEmptyLobbyId: getEmptyLobbyId,
  getLobby: getLobby,
  joinLobby: joinLobby,
  leaveLobby: leaveLobby,
};
