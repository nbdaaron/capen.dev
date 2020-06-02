const { inGameOnly } = require("./util");
const { getGame } = require("../games/bombGame");

const GAME_ID = "bomb";

// RECV_OPS
const BOMB_GAME_UPDATE_PLAYER = "BOMB_GAME_UPDATE_PLAYER";
// const BOMB_GAME_PLANT_BOMB = "BOMB_GAME_PLANT_BOMB";
// const BOMB_GAME_LOOT_POWERUP = "BOMB_GAME_LOOT_POWERUP";

// SEND_OPS
// const BOMB_GAME_UPDATE_BOARD = "BOMB_GAME_UPDATE_BOARD";

const BombGameHandler = (socket, io) => {
  socket.on(
    BOMB_GAME_UPDATE_PLAYER,
    inGameOnly(socket, GAME_ID, function (player) {
      getGame(socket.user.lobbyId).updatePlayer(socket.user, player);
    })
  );
};

module.exports = BombGameHandler;
