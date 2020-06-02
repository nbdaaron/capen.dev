const { getLobby } = require("../games/lobbies");

const authenticatedOnly = (socket, fn) => {
  return (param) => {
    if (socket.user) {
      fn(param);
    }
  };
};

const inLobbyOnly = (socket, fn) => {
  return (param) => {
    if (socket.user && socket.user.lobbyId) {
      fn(param);
    }
  };
};

const inGameOnly = (socket, gameId, fn) => {
  return (param) => {
    if (socket.user && socket.user.lobbyId) {
      const lobby = getLobby(socket.user.lobbyId);
      if (lobby.getGame() === gameId && lobby.getInGame()) {
        fn(param);
      }
    }
  };
};

module.exports = { authenticatedOnly, inLobbyOnly, inGameOnly };
