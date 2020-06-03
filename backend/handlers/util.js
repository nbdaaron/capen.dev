const authenticatedOnly = (socket, fn) => {
  return (param) => {
    if (socket.user) {
      fn(param);
    }
  };
};

const inLobbyOnly = (socket, fn) => {
  return (param) => {
    if (socket.user && socket.user.lobby) {
      fn(param);
    }
  };
};

const inGameOnly = (socket, gameId, fn) => {
  return (param) => {
    if (socket.user && socket.user.lobby) {
      const lobby = socket.user.lobby;
      if (lobby.gameId === gameId && lobby.isInGame()) {
        fn(lobby.game, param);
      }
    }
  };
};

module.exports = { authenticatedOnly, inLobbyOnly, inGameOnly };
