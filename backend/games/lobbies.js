const lobbies = {};

const MAX_LOBBY_ID = 9999999999999;

const generateRandomId = () => Math.floor(Math.random() * MAX_LOBBY_ID);
const getLobbyInfo = (id) => lobbies[id];
const getEmptyLobbyId = () => {
  let id = generateRandomId();
  while (lobbies[id]) {
    id = generateRandomId();
  }
  return id;
};

module.exports = {
  getEmptyLobbyId: getEmptyLobbyId,
  getLobbyInfo: getLobbyInfo,
};
